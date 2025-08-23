import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PixKey {
  id: string;
  type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random' | 'manual';
  value: string;
  name: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface QRCodeHistory {
  id: string;
  pixKeyId: string;
  pixKeyValue: string;
  pixKeyName: string;
  amount: string;
  description: string;
  qrCode: string;
  pixCode: string;
  createdAt: string;
  isReceived: boolean;
  isCancelled: boolean;
  cancellationReason?: string;
}

export interface PixTransaction {
  id: string;
  pixKeyId: string;
  amount: string;
  description: string;
  qrCode: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface PixStore {
  // Estado
  pixKeys: PixKey[];
  transactions: PixTransaction[];
  qrHistory: QRCodeHistory[];
  isOffline: boolean;
  
  // Ações para Chaves Pix
  addPixKey: (key: Omit<PixKey, 'id' | 'createdAt'>) => void;
  updatePixKey: (id: string, updates: Partial<PixKey>) => void;
  deletePixKey: (id: string) => void;
  setPrimaryKey: (id: string) => void;
  getPixKeyById: (id: string) => PixKey | undefined;
  getPrimaryKey: () => PixKey | undefined;
  searchPixKeys: (query: string) => PixKey[];
  filterPixKeysByType: (type: string) => PixKey[];
  
  // Ações para Transações
  addTransaction: (transaction: Omit<PixTransaction, 'id' | 'createdAt'>) => void;
  updateTransactionStatus: (id: string, status: PixTransaction['status']) => void;
  getTransactionsByKeyId: (pixKeyId: string) => PixTransaction[];
  
  // Ações para Histórico de QR Codes
  addQRHistory: (qr: Omit<QRCodeHistory, 'id' | 'createdAt'>) => void;
  updateQRReceived: (id: string, isReceived: boolean) => void;
  cancelQR: (id: string, reason: string) => void;
  getQRHistory: () => QRCodeHistory[];
  searchQRHistory: (query: string) => QRCodeHistory[];
  
  // Ações de Estado
  setOfflineStatus: (isOffline: boolean) => void;
  clearStore: () => void;
}

export const usePixStore = create<PixStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      pixKeys: [],
      transactions: [],
      qrHistory: [],
      isOffline: false,

      // Ações para Chaves Pix
      addPixKey: (newKey) => {
        set((state) => {
          let updatedKeys = state.pixKeys;
          
          // Se a nova chave for marcada como principal, remover a flag das outras
          if (newKey.isPrimary) {
            updatedKeys = state.pixKeys.map(key => ({ ...key, isPrimary: false }));
          }

          const pixKey: PixKey = {
            ...newKey,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          };

          return {
            pixKeys: [...updatedKeys, pixKey]
          };
        });
      },

      updatePixKey: (id, updates) => {
        set((state) => ({
          pixKeys: state.pixKeys.map(key => 
            key.id === id ? { ...key, ...updates } : key
          )
        }));
      },

      deletePixKey: (id) => {
        set((state) => ({
          pixKeys: state.pixKeys.filter(key => key.id !== id),
          transactions: state.transactions.filter(transaction => transaction.pixKeyId !== id),
          qrHistory: state.qrHistory.filter(qr => qr.pixKeyId !== id)
        }));
      },

      setPrimaryKey: (id) => {
        set((state) => ({
          pixKeys: state.pixKeys.map(key => ({
            ...key,
            isPrimary: key.id === id
          }))
        }));
      },

      getPixKeyById: (id) => {
        return get().pixKeys.find(key => key.id === id);
      },

      getPrimaryKey: () => {
        return get().pixKeys.find(key => key.isPrimary);
      },

      searchPixKeys: (query) => {
        const state = get();
        if (!query) return state.pixKeys;
        
        const lowercaseQuery = query.toLowerCase();
        return state.pixKeys.filter(key => 
          key.name.toLowerCase().includes(lowercaseQuery) ||
          key.value.toLowerCase().includes(lowercaseQuery)
        );
      },

      filterPixKeysByType: (type) => {
        const state = get();
        if (!type || type === 'all') return state.pixKeys;
        return state.pixKeys.filter(key => key.type === type);
      },

      // Ações para Transações
      addTransaction: (newTransaction) => {
        set((state) => {
          const transaction: PixTransaction = {
            ...newTransaction,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          };

          return {
            transactions: [...state.transactions, transaction]
          };
        });
      },

      updateTransactionStatus: (id, status) => {
        set((state) => ({
          transactions: state.transactions.map(transaction =>
            transaction.id === id ? { ...transaction, status } : transaction
          )
        }));
      },

      getTransactionsByKeyId: (pixKeyId) => {
        return get().transactions.filter(transaction => transaction.pixKeyId === pixKeyId);
      },

      // Ações para Histórico de QR Codes
      addQRHistory: (newQR) => {
        set((state) => {
          const qrHistory: QRCodeHistory = {
            ...newQR,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            isCancelled: false,
          };

          return {
            qrHistory: [qrHistory, ...state.qrHistory]
          };
        });
      },

      updateQRReceived: (id, isReceived) => {
        set((state) => ({
          qrHistory: state.qrHistory.map(qr =>
            qr.id === id ? { ...qr, isReceived } : qr
          )
        }));
      },

      cancelQR: (id, reason) => {
        set((state) => ({
          qrHistory: state.qrHistory.map(qr =>
            qr.id === id ? { ...qr, isCancelled: true, cancellationReason: reason, isReceived: false } : qr
          )
        }));
      },

      getQRHistory: () => {
        return get().qrHistory;
      },

      searchQRHistory: (query) => {
        const state = get();
        if (!query) return state.qrHistory;
        
        const lowercaseQuery = query.toLowerCase();
        return state.qrHistory.filter(qr => 
          qr.pixKeyName.toLowerCase().includes(lowercaseQuery) ||
          qr.description.toLowerCase().includes(lowercaseQuery) ||
          qr.amount.toLowerCase().includes(lowercaseQuery)
        );
      },

      // Ações de Estado
      setOfflineStatus: (isOffline) => {
        set({ isOffline });
      },

      clearStore: () => {
        set({
          pixKeys: [],
          transactions: [],
          qrHistory: [],
          isOffline: false
        });
      }
    }),
    {
      name: 'pix-store',
      version: 1,
    }
  )
);