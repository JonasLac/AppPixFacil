import { ReactNode } from 'react';
import Header from '@/components/Header';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { useOfflineSync } from '@/hooks/useOfflineSync';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout = ({ children, className = '' }: LayoutProps) => {
  useOfflineSync();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className={`max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 ${className}`}>
        {children}
      </main>
    </div>
  );
};