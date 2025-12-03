import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { menuService } from '../services/menu.service';
import { useAuth } from './AuthContext';
import type { MenuItem, MenuPermission } from '../types/menu';

interface MenuContextType {
  menuItems: MenuItem[];
  menuPermissionsByNivel: Record<string, MenuPermission[]>;
  expandedItems: Set<string>;
  selectedNivelAcesso: string;
  isLoading: boolean;
  loadUserMenu: (role?: string) => Promise<void>;
  loadMenuPermissionsByNivel: (nivel: string) => Promise<void>;
  toggleMenuPermission: (menuItem: string, nivelAcesso: string) => Promise<void>;
  toggleExpandedItem: (menuItem: string) => void;
  hasMenuAccess: (menuItem: string) => boolean;
  setSelectedNivelAcesso: (nivel: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuPermissionsByNivel, setMenuPermissionsByNivel] = useState<Record<string, MenuPermission[]>>({});
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedNivelAcesso, setSelectedNivelAcesso] = useState<string>('ESTRATEGICO');
  const [isLoading, setIsLoading] = useState(false);


  // Função para remover duplicatas recursivamente
  const removeDuplicates = (items: MenuItem[]): MenuItem[] => {
    if (!items || items.length === 0) return [];
    
    const seen = new Set<string>();
    const result: MenuItem[] = [];

    const processItem = (item: MenuItem, parentPath: string = ''): MenuItem | null => {
      // Criar chave única baseada no caminho completo (parent + menuItem)
      const fullPath = parentPath ? `${parentPath}/${item.menuItem}` : item.menuItem;
      const key = fullPath;
      
      // Se já vimos este item neste caminho, retornar null
      if (seen.has(key)) {
        return null;
      }
      
      seen.add(key);
      
      // Processar filhos recursivamente
      const processedChildren: MenuItem[] = [];
      if (item.children && item.children.length > 0) {
        // Remover duplicatas dos filhos também
        const uniqueChildren = new Map<string, MenuItem>();
        item.children.forEach(child => {
          if (!uniqueChildren.has(child.menuItem)) {
            const processedChild = processItem(child, key);
            if (processedChild) {
              uniqueChildren.set(child.menuItem, processedChild);
            }
          }
        });
        processedChildren.push(...Array.from(uniqueChildren.values()));
      }
      
      return {
        ...item,
        children: processedChildren.length > 0 ? processedChildren : undefined,
      };
    };

    // Processar itens raiz, removendo duplicatas
    const uniqueRoots = new Map<string, MenuItem>();
    items.forEach(item => {
      if (!uniqueRoots.has(item.menuItem)) {
        const processed = processItem(item);
        if (processed) {
          uniqueRoots.set(item.menuItem, processed);
        }
      }
    });

    return Array.from(uniqueRoots.values());
  };

  const loadUserMenu = async (role?: string) => {
    setIsLoading(true);
    try {
      // Sempre usar getMyMenu que já trata ADMIN corretamente no backend
      const response = await menuService.getMyMenu();
      if (response.success) {
        const menuTree = response.data || [];
        // Garantir que não há duplicatas e que está em formato de array
        const cleanMenu = Array.isArray(menuTree) ? menuTree : [];
        // Remover duplicatas recursivamente
        const uniqueMenu = removeDuplicates(cleanMenu);
        setMenuItems(uniqueMenu);
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      console.error('Erro ao carregar menu do usuário:', error);
      setMenuItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMenuPermissionsByNivel = async (nivel: string) => {
    try {
      const response = await menuService.getByNivelAcesso(nivel);
      if (response.success) {
        setMenuPermissionsByNivel(prev => ({
          ...prev,
          [nivel]: response.data || []
        }));
      }
    } catch (error) {
      console.error(`Erro ao carregar permissões para ${nivel}:`, error);
    }
  };

  const toggleMenuPermission = async (menuItem: string, nivelAcesso: string) => {
    try {
      await menuService.toggle(menuItem, nivelAcesso);
      await loadMenuPermissionsByNivel(nivelAcesso);
    } catch (error: any) {
      console.error('Erro ao atualizar permissão:', error);
      throw error;
    }
  };

  const toggleExpandedItem = (menuItem: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuItem)) {
        newSet.delete(menuItem);
      } else {
        newSet.add(menuItem);
      }
      return newSet;
    });
  };

  const hasMenuAccess = (menuItem: string): boolean => {
    // ADMIN sempre tem acesso
    if (user?.role === 'ADMIN') return true;
    
    // Se não há menuItems carregados, não bloquear (pode estar carregando)
    if (!menuItems || menuItems.length === 0) return true;
    
    // Verificar recursivamente se o item está no menu do usuário
    const checkAccess = (items: MenuItem[]): boolean => {
      for (const item of items) {
        if (item.menuItem === menuItem && item.active !== false) {
          return true;
        }
        
        if (item.children && item.children.length > 0) {
          if (checkAccess(item.children)) return true;
        }
      }
      return false;
    };
    
    return checkAccess(menuItems);
  };

  // Carregar menu quando usuário mudar
  useEffect(() => {
    if (user && user.id) {
      // Usar um pequeno delay para evitar múltiplas chamadas
      const timer = setTimeout(() => {
        loadUserMenu(user.role);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setMenuItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role]);

  const value: MenuContextType = {
    menuItems,
    menuPermissionsByNivel,
    expandedItems,
    selectedNivelAcesso,
    isLoading,
    loadUserMenu,
    loadMenuPermissionsByNivel,
    toggleMenuPermission,
    toggleExpandedItem,
    hasMenuAccess,
    setSelectedNivelAcesso,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

