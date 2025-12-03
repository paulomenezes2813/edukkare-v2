import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const value: AppContextType = {
    currentScreen,
    setCurrentScreen,
    showSidebar,
    setShowSidebar,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

