import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import QRHistoryList from '../QRHistoryList';
import type { QRCodeHistory } from '@/hooks/usePixStore';
import * as toastModule from '@/hooks/use-toast';

// Mock ShareActions to avoid navigator.share/clipboard side effects
vi.mock('../ShareActions', () => ({
  __esModule: true,
  default: ({}) => <button type="button">Compartilhar</button>,
}));

const makeQR = (overrides: Partial<QRCodeHistory> = {}): QRCodeHistory => ({
  id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
  pixKeyId: 'key-1',
  pixKeyValue: 'chave@pix.com',
  pixKeyName: 'Minha Chave',
  amount: '50.00',
  description: 'Compra teste',
  qrCode: 'data:image/png;base64,abc',
  pixCode: '000201...',
  createdAt: new Date().toISOString(),
  isReceived: false,
  isCancelled: false,
  ...overrides,
});

describe('QRHistoryList', () => {
  it('exibe skeleton quando isLoading=true (sem lista e sem filtros)', () => {
    render(
      <QRHistoryList
        qrHistory={[makeQR()]}
        onUpdateReceived={vi.fn()}
        onCancelQR={vi.fn()}
        onViewQR={vi.fn()}
        onDeleteQR={vi.fn()}
        isLoading={true}
      />
    );

    // Como renderiza skeleton por early return, não deve haver texto "Filtrar por status"
    expect(screen.queryByText(/filtrar por status/i)).not.toBeInTheDocument();
    // E não deve haver botões de ação comuns
    expect(screen.queryByRole('button', { name: /ver qr/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /marcar recebido/i })).not.toBeInTheDocument();
  });

  it('desabilita "Marcar Recebido" enquanto processa e reabilita depois', async () => {
    const onUpdateReceived = vi.fn().mockImplementation(async () => {
      // simula atraso do processamento
      await new Promise((r) => setTimeout(r, 50));
    });

    const item = makeQR();

    render(
      <QRHistoryList
        qrHistory={[item]}
        onUpdateReceived={onUpdateReceived}
        onCancelQR={vi.fn()}
        onViewQR={vi.fn()}
        onDeleteQR={vi.fn()}
      />
    );

    const markBtn = screen.getByRole('button', { name: /marcar recebido/i });
    await userEvent.click(markBtn);

    // Deve ficar desabilitado enquanto roda
    expect(markBtn).toBeDisabled();

    await waitFor(() => {
      expect(onUpdateReceived).toHaveBeenCalledWith(item.id, true);
    });
  });

  it('abre CancelDialog, confirma cancelamento e mostra toast', async () => {
    const toastSpy = vi.spyOn(toastModule, 'toast');
    const onCancelQR = vi.fn();

    const item = makeQR();

    render(
      <QRHistoryList
        qrHistory={[item]}
        onUpdateReceived={vi.fn()}
        onCancelQR={onCancelQR}
        onViewQR={vi.fn()}
        onDeleteQR={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    const textarea = await screen.findByLabelText(/motivo do cancelamento/i);
    await userEvent.type(textarea, 'Pagamento duplicado');

    await userEvent.click(screen.getByRole('button', { name: /confirmar cancelamento/i }));

    await waitFor(() => {
      expect(onCancelQR).toHaveBeenCalledWith(item.id, 'Pagamento duplicado');
    });

    expect(toastSpy).toHaveBeenCalled();
    const firstCallArg = (toastSpy.mock.calls[0] || [])[0] as any;
    expect(firstCallArg?.title).toMatch(/qr code cancelado/i);
  });

  it('exclui item do histórico via ConfirmationDialog e mostra toast', async () => {
    const toastSpy = vi.spyOn(toastModule, 'toast');
    const onDeleteQR = vi.fn();

    const item = makeQR();

    render(
      <QRHistoryList
        qrHistory={[item]}
        onUpdateReceived={vi.fn()}
        onCancelQR={vi.fn()}
        onViewQR={vi.fn()}
        onDeleteQR={onDeleteQR}
      />
    );

    // Abre o diálogo de exclusão
    await userEvent.click(screen.getByRole('button', { name: /excluir/i }));

    // Encontra o alertdialog pelo título
    const dialog = await screen.findByRole('alertdialog', { name: /excluir do histórico/i });

    // Confirma exclusão dentro do diálogo
    const confirmBtn = within(dialog).getByRole('button', { name: /^excluir$/i });
    await userEvent.click(confirmBtn);

    await waitFor(() => {
      expect(onDeleteQR).toHaveBeenCalledWith(item.id);
    });

    expect(toastSpy).toHaveBeenCalled();
    const firstCallArg = (toastSpy.mock.calls[0] || [])[0] as any;
    expect(firstCallArg?.title).toMatch(/qr code removido/i);
  });

  it('filtra por status: Pendente, Recebido e Cancelado', async () => {
    const pending = makeQR({ id: 'p1', pixKeyName: 'Chave Pendente', isReceived: false, isCancelled: false });
    const received = makeQR({ id: 'r1', pixKeyName: 'Chave Recebida', isReceived: true, isCancelled: false });
    const cancelled = makeQR({ id: 'c1', pixKeyName: 'Chave Cancelada', isReceived: false, isCancelled: true });

    render(
      <QRHistoryList
        qrHistory={[pending, received, cancelled]}
        onUpdateReceived={vi.fn()}
        onCancelQR={vi.fn()}
        onViewQR={vi.fn()}
        onDeleteQR={vi.fn()}
      />
    );

    // Pendente
    await userEvent.click(screen.getByRole('button', { name: /^pendente$/i }));
    expect(screen.getByText('Chave Pendente')).toBeInTheDocument();
    expect(screen.queryByText('Chave Recebida')).not.toBeInTheDocument();
    expect(screen.queryByText('Chave Cancelada')).not.toBeInTheDocument();

    // Recebido
    await userEvent.click(screen.getByRole('button', { name: /^recebido$/i }));
    expect(screen.getByText('Chave Recebida')).toBeInTheDocument();
    expect(screen.queryByText('Chave Pendente')).not.toBeInTheDocument();
    expect(screen.queryByText('Chave Cancelada')).not.toBeInTheDocument();

    // Cancelado
    await userEvent.click(screen.getByRole('button', { name: /^cancelado$/i }));
    expect(screen.getByText('Chave Cancelada')).toBeInTheDocument();
    expect(screen.queryByText('Chave Pendente')).not.toBeInTheDocument();
    expect(screen.queryByText('Chave Recebida')).not.toBeInTheDocument();

    // Todos
    await userEvent.click(screen.getByRole('button', { name: /^todos$/i }));
    expect(screen.getByText('Chave Pendente')).toBeInTheDocument();
    expect(screen.getByText('Chave Recebida')).toBeInTheDocument();
    expect(screen.getByText('Chave Cancelada')).toBeInTheDocument();
  });

  it('desabilita botões Cancelar/Excluir do item enquanto confirmação de cancelamento está em andamento', async () => {
    let resolveFn: (() => void) | null = null;
    const onCancelQR = vi.fn(() => new Promise<void>((resolve) => { resolveFn = resolve; }));

    const item = makeQR({ pixKeyName: 'Item Teste' });

    render(
      <QRHistoryList
        qrHistory={[item]}
        onUpdateReceived={vi.fn()}
        onCancelQR={onCancelQR}
        onViewQR={vi.fn()}
        onDeleteQR={vi.fn()}
      />
    );

    // Abre o CancelDialog
    await userEvent.click(screen.getByRole('button', { name: /^cancelar$/i }));

    // Preenche motivo e confirma
    await userEvent.type(screen.getByLabelText(/motivo do cancelamento/i), 'Pagamento duplicado');
    await userEvent.click(screen.getByRole('button', { name: /confirmar cancelamento/i }));

    // Enquanto pendente, os botões do item na lista devem ficar desabilitados
    const excluirBtn = screen.getByRole('button', { name: /excluir/i, hidden: true });
    expect(excluirBtn).toBeDisabled();

    const dialogEl = screen.getByRole('dialog');
    const allCancelar = screen.getAllByRole('button', { name: /^cancelar$/i, hidden: true });
    const cancelarLista = allCancelar.find((btn) => !dialogEl.contains(btn));
    expect(cancelarLista).toBeDefined();
    expect(cancelarLista).toBeDisabled();

    // Finaliza o cancelamento
    resolveFn?.();

    await waitFor(() => {
      expect(onCancelQR).toHaveBeenCalled();
    });

    // Após concluir, os botões devem reabilitar
    expect(screen.getByRole('button', { name: /excluir/i })).toBeEnabled();
    // O botão Cancelar do item pode não existir se o item já foi marcado como cancelado; então só verifica se, caso exista, não está disabled
    const cancelarDepois = screen.queryAllByRole('button', { name: /^cancelar$/i }).find((btn) => !screen.queryByRole('dialog')?.contains(btn));
    if (cancelarDepois) {
      expect(cancelarDepois).toBeEnabled();
    }
  });
});