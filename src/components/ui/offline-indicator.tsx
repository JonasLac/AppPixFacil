import { WifiOff, Wifi } from 'lucide-react';
import { usePixStore } from '@/hooks/usePixStore';
import { cn } from '@/lib/utils';

export const OfflineIndicator = () => {
  const { isOffline } = usePixStore();

  if (!isOffline) return null;

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg',
      'bg-destructive text-destructive-foreground text-sm font-medium',
      'animate-fade-in animate-pulse'
    )}>
      <WifiOff className="w-4 h-4 animate-pulse" />
      Offline
    </div>
  );
};

export const OnlineIndicator = () => {
  const { isOffline } = usePixStore();

  if (isOffline) return null;

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg',
      'bg-primary text-primary-foreground text-sm font-medium',
      'animate-fade-in'
    )}>
      <Wifi className="w-4 h-4" />
      Online
    </div>
  );
};