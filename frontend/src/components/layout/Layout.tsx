import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { COLORS } from '../../utils/constants';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: COLORS.backgroundSecondary }}>
      <Header onMenuClick={() => setShowSidebar(true)} />
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
      <main
        style={{
          padding: '1rem',
          marginTop: '0',
          minHeight: 'calc(100vh - 80px)',
        }}
      >
        {children}
      </main>
    </div>
  );
};

