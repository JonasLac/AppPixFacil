import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import CancelDialog from '../CancelDialog';
import type { QRCodeHistory } from '@/hooks/usePixStore';
import * as toastModule from '@/hooks/use-toast';

const makeQR = (overrides: Partial<QRCodeHistory> = {}): QRCodeHistory => ({
  id: '1',
  pixKeyId: 'key-1',
  pixKeyValue: 'chave@pix.com',
  pixKeyName: 'Minha Chave',
  amount: '123.45',
  description: 'Teste de cancelamento',
  qrCode: 'data:image/png;base64,abc',
  pixCode: '000201...',
  createdAt: new Date().toISOString(),
  isReceived: false,
  isCancelled: false,
  ...overrides,
});

describe('CancelDialog', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('desabilita confirmar quando motivo está vazio e não dispara toast', async () => {
    const toastSpy = vi.spyOn(toastModule, 'toast').mockImplementation(() => ({ id: '1', dismiss: vi.fn(), update: vi.fn() } as any));

    render(
      <CancelDialog
        qr={makeQR()}
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    const confirmar = screen.getByRole('button', { name: /confirmar cancelamento/i });
    expect(confirmar).toBeDisabled();

    // Tentar clicar não deve disparar toast pois está desabilitado
    await userEvent.click(confirmar);
    expect(toastSpy).not.toHaveBeenCalled();

    // Ao digitar um motivo, o botão habilita
    const textarea = screen.getByLabelText(/motivo do cancelamento/i);
    await userEvent.type(textarea, 'Motivo válido');
    expect(screen.getByRole('button', { name: /confirmar cancelamento/i })).toBeEnabled();
  });

  it('bloqueia ações e mostra loading enquanto cancela, depois fecha e limpa motivo', async () => {
    const onOpenChange = vi.fn();
    let resolveFn: (() => void) | null = null;
    const onConfirm = vi.fn(() => new Promise<void>((resolve) => { resolveFn = resolve; }));

    render(
      <CancelDialog
        qr={makeQR()}
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />
    );

    const textarea = screen.getByLabelText(/motivo do cancelamento/i);
    await userEvent.type(textarea, 'Cliente desistiu');

    const confirmar = screen.getByRole('button', { name: /confirmar cancelamento/i });
    await userEvent.click(confirmar);

    // onConfirm chamado com id e motivo
    expect(onConfirm).toHaveBeenCalledTimes(1);
    const [qrId, reason] = onConfirm.mock.calls[0];
    expect(qrId).toBe('1');
    expect(reason).toBe('Cliente desistiu');

    // Estado de loading visível e botões desabilitados
    expect(screen.getByText(/cancelando\.\.\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeDisabled();

    // Concluir promessa para finalizar cancelamento
    resolveFn?.();

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    // Textarea deve ser limpo após confirmar
    const textareaAfter = screen.getByLabelText(/motivo do cancelamento/i) as HTMLTextAreaElement;
    expect(textareaAfter.value).toBe('');
  });

  it('fecha ao clicar em Cancelar quando não está carregando e limpa o motivo', async () => {
    const onOpenChange = vi.fn();

    render(
      <CancelDialog
        qr={makeQR()}
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={vi.fn()}
      />
    );

    const textarea = screen.getByLabelText(/motivo do cancelamento/i) as HTMLTextAreaElement;
    await userEvent.type(textarea, 'Qualquer motivo');

    const cancelar = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelar);

    expect(onOpenChange).toHaveBeenCalledWith(false);
    // Como o componente ainda está montado (open controlado externamente), validamos que o campo foi limpo
    expect(textarea.value).toBe('');
  });

  it('ignora clique em Cancelar durante o carregamento', async () => {
    const onOpenChange = vi.fn();
    let resolveFn: (() => void) | null = null;
    const onConfirm = vi.fn(() => new Promise<void>((resolve) => { resolveFn = resolve; }));

    render(
      <CancelDialog
        qr={makeQR()}
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />
    );

    await userEvent.type(screen.getByLabelText(/motivo do cancelamento/i), 'Motivo');

    await userEvent.click(screen.getByRole('button', { name: /confirmar cancelamento/i }));

    // Enquanto pendente, clicar em Cancelar não deve chamar onOpenChange
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onOpenChange).not.toHaveBeenCalled();

    resolveFn?.();

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});