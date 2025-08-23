import { useEffect } from 'react';
import { usePixStore } from './usePixStore';
import { toast } from '@/hooks/use-toast';

export const useOfflineSync = () => {
  const { setOfflineStatus, transactions } = usePixStore();

  useEffect(() => {
    const handleOnline = () => {
      setOfflineStatus(false);
      
      // Sincronizar transações pendentes quando voltar online
      const pendingTransactions = transactions.filter(t => t.status === 'pending');
      
      if (pendingTransactions.length > 0) {
        toast({
          title: "Conectado!",
          description: `${pendingTransactions.length} transação(ões) pendente(s) serão sincronizadas.`,
        });
        
        // Aqui você pode implementar a lógica de sincronização com o backend
        // Por exemplo, enviar as transações para uma API
      }
    };

    const handleOffline = () => {
      setOfflineStatus(true);
      toast({
        title: "Modo Offline",
        description: "As transações serão salvas localmente e sincronizadas quando você voltar online.",
        variant: "destructive",
      });
    };

    // Verificar status inicial
    if (navigator.onLine) {
      setOfflineStatus(false);
    } else {
      setOfflineStatus(true);
    }

    // Escutar mudanças de conectividade
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOfflineStatus, transactions]);
};