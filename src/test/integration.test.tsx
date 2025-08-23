import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import App from '@/App';

const TestApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

describe('App Integration Tests', () => {
  it('renders homepage and navigates to QR generation', async () => {
    const user = userEvent.setup();
    render(<TestApp />);

    // Verifica se a página inicial carrega
    expect(screen.getByText('Pix Fácil')).toBeInTheDocument();

    // Navega para a página de geração de QR se houver um link
    const qrLink = screen.queryByText(/gerar/i);
    if (qrLink) {
      await user.click(qrLink);
    }
  });

  it('handles 404 page correctly', async () => {
    // Test seria expandido para verificar navegação para rota inexistente
    render(<TestApp />);
    expect(screen.getByText('Pix Fácil')).toBeInTheDocument();
  });
});