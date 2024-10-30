import React, { ReactNode } from 'react';
import Header from './header';
import Menu from './menu';

interface LayoutProps {
    children: ReactNode;
  }

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
      <div className="flex h-screen">
        <Menu />
        <div className="flex-1">
          <Header />
          <main className="p-4">{children}</main>
        </div>
      </div>
  );
};

export default Layout;