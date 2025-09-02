import { PixKey, PixTransaction } from '@/hooks/usePixStore';

// Service para integração com APIs e lógica de negócio do Pix
export class PixService {
  private static readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  // Validar chave Pix (simulação - em produção seria uma API real)
  static async validatePixKey(type: PixKey['type'], value: string): Promise<boolean> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (type) {
      case 'cpf':
        return this.isValidCPF(value);
      case 'cnpj':
        return this.isValidCNPJ(value);
      case 'email':
        return this.isValidEmail(value);
      case 'phone':
        return this.isValidPhone(value);
      case 'random':
        return this.isValidRandomKey(value);
      default:
        return true; // Chave manual sempre válida
    }
  }

  // Sincronizar transações com backend (simulação)
  static async syncTransactions(transactions: PixTransaction[]): Promise<void> {
    if (!this.API_BASE_URL) {
      console.log('API não configurada - transações salvas apenas localmente');
      return;
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/transactions/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactions }),
      });

      if (!response.ok) {
        throw new Error('Falha na sincronização');
      }
    } catch (error) {
      console.error('Erro ao sincronizar transações:', error);
      throw error;
    }
  }

  // Backup de dados (simulação)
  static async backupData(data: { pixKeys: PixKey[]; transactions: PixTransaction[] }): Promise<void> {
    if (!this.API_BASE_URL) {
      // Fazer backup local como fallback
      const backup = {
        ...data,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('pix-backup', JSON.stringify(backup));
      return;
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/backup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Falha no backup');
      }
    } catch (error) {
      console.error('Erro ao fazer backup:', error);
      throw error;
    }
  }

  // Validações auxiliares
  private static isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !/^\d+$/.test(cpf)) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.charAt(10));
  }

  private static isValidCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    // Validar dígitos verificadores
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    const digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    const result1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result1 !== parseInt(digits.charAt(0))) return false;
    
    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    const result2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result2 === parseInt(digits.charAt(1));
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{10,14}$/;
    return phoneRegex.test(phone.replace(/[^\d+]/g, ''));
  }

  private static isValidRandomKey(key: string): boolean {
    // Chave aleatória deve ter formato UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(key);
  }
}