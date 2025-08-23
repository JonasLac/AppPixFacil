import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema para validação de chave Pix
export const pixKeySchema = z.object({
  type: z.enum(['cpf', 'cnpj', 'email', 'phone', 'random', 'manual']),
  value: z.string().min(1, 'Campo obrigatório'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  isPrimary: z.boolean().default(false),
});

// Schema para validação de pagamento
export const paymentSchema = z.object({
  amount: z.string()
    .min(1, 'Valor é obrigatório')
    .refine((val) => {
      const num = parseFloat(val.replace(',', '.'));
      return !isNaN(num) && num > 0;
    }, 'Valor deve ser maior que zero'),
  description: z.string().max(140, 'Descrição deve ter no máximo 140 caracteres').optional(),
});

// Schema para configurações
export const settingsSchema = z.object({
  notifications: z.boolean().default(true),
  darkMode: z.boolean().default(false),
  autoBackup: z.boolean().default(true),
  defaultExpiration: z.number().min(5).max(1440).default(60), // minutos
});

export type PixKeyFormData = z.infer<typeof pixKeySchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;

// Hook personalizado para formulário de chave Pix
export const usePixKeyForm = (defaultValues?: Partial<PixKeyFormData>) => {
  return useForm<PixKeyFormData>({
    resolver: zodResolver(pixKeySchema),
    defaultValues: {
      type: 'cpf',
      value: '',
      name: '',
      isPrimary: false,
      ...defaultValues,
    },
  });
};

// Hook personalizado para formulário de pagamento
export const usePaymentForm = (defaultValues?: Partial<PaymentFormData>) => {
  return useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: '',
      description: '',
      ...defaultValues,
    },
  });
};

// Hook personalizado para formulário de configurações
export const useSettingsForm = (defaultValues?: Partial<SettingsFormData>) => {
  return useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      notifications: true,
      darkMode: false,
      autoBackup: true,
      defaultExpiration: 60,
      ...defaultValues,
    },
  });
};