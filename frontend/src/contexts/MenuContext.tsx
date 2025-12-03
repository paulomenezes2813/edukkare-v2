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


  const loadUserMenu = async (role?: string) => {
    setIsLoading(true);
    try {
      // Sempre usar getMyMenu que já trata ADMIN corretamente no backend
      const response = await menuService.getMyMenu();
      if (response.success) {
        const menuTree = response.data || [];
        // Garantir que não há duplicatas e que está em formato de array
        const cleanMenu = Array.isArray(menuTree) ? menuTree : [];
        setMenuItems(cleanMenu);
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
    if (user) {
      loadUserMenu(user.role);
    } else {
      setMenuItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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

