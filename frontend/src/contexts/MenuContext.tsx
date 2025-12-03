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

  // Função auxiliar para construir árvore de menu
  const buildMenuTree = (permissions: MenuPermission[]): MenuItem[] => {
    if (!permissions || permissions.length === 0) return [];
    
    const map = new Map<string, MenuItem>();
    const roots: MenuItem[] = [];

    // Criar mapa de todos os itens
    permissions.forEach(perm => {
      map.set(perm.menuItem, {
        id: perm.menuItem,
        menuItem: perm.menuItem,
        menuLabel: perm.menuLabel,
        parentItem: perm.parentItem,
        nivelAcesso: perm.nivelAcesso,
        order: perm.order,
        icon: perm.icon || undefined,
        screen: perm.screen || undefined,
        active: perm.active,
        children: [],
      });
    });

    // Construir árvore
    permissions.forEach(perm => {
      const node = map.get(perm.menuItem);
      if (!node) return;
      
      if (perm.parentItem) {
        const parent = map.get(perm.parentItem);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Ordenar por ordem
    const sortByOrder = (items: MenuItem[]) => {
      items.sort((a, b) => a.order - b.order);
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          sortByOrder(item.children);
        }
      });
    };

    sortByOrder(roots);
    return roots;
  };

  const loadUserMenu = async (role?: string) => {
    setIsLoading(true);
    try {
      const currentRole = role || user?.role || 'PROFESSOR';

      // ADMIN sempre tem acesso total
      if (currentRole === 'ADMIN') {
        const response = await menuService.getAll();
        if (response.success) {
          const permissions = response.data || [];
          const menuTree = buildMenuTree(permissions);
          setMenuItems(menuTree);
        }
        return;
      }

      const response = await menuService.getMyMenu();
      if (response.success) {
        const menuTree = response.data || [];
        setMenuItems(menuTree);
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
    if (user?.role === 'ADMIN') return true;
    if (!user?.nivelAcesso) return true;
    if (!menuItems || menuItems.length === 0) return true;
    
    const checkAccess = (items: MenuItem[] | MenuPermission[]): boolean => {
      for (const item of items) {
        const itemId = (item as MenuItem).menuItem || (item as MenuPermission).menuItem;
        const isActive = (item as MenuItem).active !== undefined 
          ? (item as MenuItem).active 
          : (item as MenuPermission).active;
        
        if (itemId === menuItem && isActive) {
          return true;
        }
        
        const children = (item as MenuItem).children;
        if (children && children.length > 0) {
          if (checkAccess(children)) return true;
        }
      }
      return false;
    };
    
    return checkAccess(menuItems);
  };

  // Carregar menu quando usuário mudar
  useEffect(() => {
    if (user) {
      loadUserMenu();
    }
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

