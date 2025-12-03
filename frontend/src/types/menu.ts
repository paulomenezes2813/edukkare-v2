export interface MenuItem {
  id: string;
  menuItem: string;
  menuLabel: string;
  parentItem?: string | null;
  nivelAcesso: string;
  order: number;
  icon?: string | null;
  screen?: string | null;
  active: boolean;
  children?: MenuItem[];
}

export interface MenuPermission {
  menuItem: string;
  menuLabel: string;
  parentItem?: string | null;
  nivelAcesso: string;
  order: number;
  icon?: string | null;
  screen?: string | null;
  active: boolean;
}

