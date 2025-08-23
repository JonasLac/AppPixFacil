// Utilitários para validação de dados

export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  const match = numbers.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  return match ? `${match[1]}.${match[2]}.${match[3]}-${match[4]}` : numbers;
};

export const formatCNPJ = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  const match = numbers.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
  return match ? `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}` : numbers;
};

export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 10) {
    const match = numbers.match(/^(\d{2})(\d{4})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : numbers;
  } else {
    const match = numbers.match(/^(\d{2})(\d{5})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : numbers;
  }
};

export const formatCurrency = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  const amount = parseFloat(numbers) / 100;
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const parseCurrency = (value: string): number => {
  const numbers = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(numbers) || 0;
};

export const validatePixKeyByType = (type: string, value: string): boolean => {
  const cleanValue = value.replace(/\D/g, '');
  
  switch (type) {
    case 'cpf':
      return cleanValue.length === 11;
    case 'cnpj':
      return cleanValue.length === 14;
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'phone':
      return cleanValue.length >= 10 && cleanValue.length <= 11;
    case 'random':
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    default:
      return value.length > 0;
  }
};

export const maskPixKey = (type: string, value: string): string => {
  switch (type) {
    case 'cpf':
      return formatCPF(value);
    case 'cnpj':
      return formatCNPJ(value);
    case 'phone':
      return formatPhone(value);
    case 'email':
      return value.toLowerCase();
    default:
      return value;
  }
};

export const getPixKeyLabel = (type: string): string => {
  const labels = {
    cpf: 'CPF',
    cnpj: 'CNPJ',
    email: 'E-mail',
    phone: 'Telefone',
    random: 'Chave Aleatória',
    manual: 'Chave Manual',
  };
  return labels[type as keyof typeof labels] || 'Chave Pix';
};

export const getPixKeyPlaceholder = (type: string): string => {
  const placeholders = {
    cpf: '000.000.000-00',
    cnpj: '00.000.000/0000-00',
    email: 'email@exemplo.com',
    phone: '(11) 99999-9999',
    random: '12345678-1234-1234-1234-123456789012',
    manual: 'Digite sua chave',
  };
  return placeholders[type as keyof typeof placeholders] || '';
};