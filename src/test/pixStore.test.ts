import { describe, it, expect, beforeEach } from 'vitest';
import { usePixStore } from '@/hooks/usePixStore';

describe('PixStore', () => {
  beforeEach(() => {
    // Limpar o store antes de cada teste
    usePixStore.getState().clearStore();
  });

  describe('PixKey Management', () => {
    it('should add a new pix key', () => {
      const { addPixKey, pixKeys } = usePixStore.getState();
      
      addPixKey({
        type: 'cpf',
        value: '12345678901',
        name: 'João Silva',
        isPrimary: true,
      });

      expect(pixKeys).toHaveLength(1);
      expect(pixKeys[0]).toMatchObject({
        type: 'cpf',
        value: '12345678901',
        name: 'João Silva',
        isPrimary: true,
      });
      expect(pixKeys[0].id).toBeDefined();
      expect(pixKeys[0].createdAt).toBeDefined();
    });

    it('should set only one primary key', () => {
      const { addPixKey, pixKeys } = usePixStore.getState();
      
      // Adicionar primeira chave como primária
      addPixKey({
        type: 'cpf',
        value: '12345678901',
        name: 'João Silva',
        isPrimary: true,
      });

      // Adicionar segunda chave como primária
      addPixKey({
        type: 'email',
        value: 'joao@email.com',
        name: 'João Silva',
        isPrimary: true,
      });

      const primaryKeys = pixKeys.filter(key => key.isPrimary);
      expect(primaryKeys).toHaveLength(1);
      expect(primaryKeys[0].type).toBe('email');
    });

    it('should delete a pix key', () => {
      const { addPixKey, deletePixKey, pixKeys } = usePixStore.getState();
      
      addPixKey({
        type: 'cpf',
        value: '12345678901',
        name: 'João Silva',
        isPrimary: false,
      });

      const keyId = pixKeys[0].id;
      deletePixKey(keyId);

      expect(pixKeys).toHaveLength(0);
    });

    it('should update a pix key', () => {
      const { addPixKey, updatePixKey, pixKeys } = usePixStore.getState();
      
      addPixKey({
        type: 'cpf',
        value: '12345678901',
        name: 'João Silva',
        isPrimary: false,
      });

      const keyId = pixKeys[0].id;
      updatePixKey(keyId, { name: 'João Santos', isPrimary: true });

      expect(pixKeys[0].name).toBe('João Santos');
      expect(pixKeys[0].isPrimary).toBe(true);
    });

    it('should get primary key', () => {
      const { addPixKey, getPrimaryKey } = usePixStore.getState();
      
      addPixKey({
        type: 'cpf',
        value: '12345678901',
        name: 'João Silva',
        isPrimary: true,
      });

      const primaryKey = getPrimaryKey();
      expect(primaryKey).toBeDefined();
      expect(primaryKey?.isPrimary).toBe(true);
    });
  });

  describe('Transaction Management', () => {
    it('should add a new transaction', () => {
      const { addPixKey, addTransaction, transactions, pixKeys } = usePixStore.getState();
      
      // Primeiro adicionar uma chave Pix
      addPixKey({
        type: 'cpf',
        value: '12345678901',
        name: 'João Silva',
        isPrimary: true,
      });

      const pixKeyId = pixKeys[0].id;
      
      addTransaction({
        pixKeyId,
        amount: '100.00',
        description: 'Pagamento teste',
        qrCode: 'test-qr-code',
        status: 'pending',
      });

      expect(transactions).toHaveLength(1);
      expect(transactions[0]).toMatchObject({
        pixKeyId,
        amount: '100.00',
        description: 'Pagamento teste',
        qrCode: 'test-qr-code',
        status: 'pending',
      });
    });

    it('should update transaction status', () => {
      const { 
        addPixKey, 
        addTransaction, 
        updateTransactionStatus, 
        transactions, 
        pixKeys 
      } = usePixStore.getState();
      
      addPixKey({
        type: 'cpf',
        value: '12345678901',
        name: 'João Silva',
        isPrimary: true,
      });

      const pixKeyId = pixKeys[0].id;
      
      addTransaction({
        pixKeyId,
        amount: '100.00',
        description: 'Pagamento teste',
        qrCode: 'test-qr-code',
        status: 'pending',
      });

      const transactionId = transactions[0].id;
      updateTransactionStatus(transactionId, 'completed');

      expect(transactions[0].status).toBe('completed');
    });

    it('should get transactions by key id', () => {
      const { 
        addPixKey, 
        addTransaction, 
        getTransactionsByKeyId, 
        pixKeys 
      } = usePixStore.getState();
      
      addPixKey({
        type: 'cpf',
        value: '12345678901',
        name: 'João Silva',
        isPrimary: true,
      });

      const pixKeyId = pixKeys[0].id;
      
      addTransaction({
        pixKeyId,
        amount: '100.00',
        description: 'Pagamento 1',
        qrCode: 'test-qr-code-1',
        status: 'pending',
      });

      addTransaction({
        pixKeyId,
        amount: '200.00',
        description: 'Pagamento 2',
        qrCode: 'test-qr-code-2',
        status: 'completed',
      });

      const keyTransactions = getTransactionsByKeyId(pixKeyId);
      expect(keyTransactions).toHaveLength(2);
    });
  });
});