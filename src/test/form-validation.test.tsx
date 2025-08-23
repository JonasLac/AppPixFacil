import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import PaymentForm from '@/components/PaymentForm';

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('PaymentForm - Form Validation', () => {
  const mockOnGenerateQR = vi.fn();

  beforeEach(() => {
    mockOnGenerateQR.mockClear();
  });

  it('shows error when trying to submit with empty amount', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <PaymentForm onGenerateQR={mockOnGenerateQR} />
      </TestWrapper>
    );

    const generateButton = screen.getByRole('button', { name: /gerar qr code/i });
    await user.click(generateButton);

    expect(mockOnGenerateQR).not.toHaveBeenCalled();
  });

  it('shows error when trying to submit with invalid amount', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <PaymentForm onGenerateQR={mockOnGenerateQR} />
      </TestWrapper>
    );

    const amountInput = screen.getByLabelText(/valor/i);
    const generateButton = screen.getByRole('button', { name: /gerar qr code/i });

    await user.type(amountInput, '0');
    await user.click(generateButton);

    expect(mockOnGenerateQR).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(
      <TestWrapper>
        <PaymentForm onGenerateQR={mockOnGenerateQR} />
      </TestWrapper>
    );

    const amountInput = screen.getByLabelText(/valor/i);
    const descriptionInput = screen.getByLabelText(/descrição/i);
    const generateButton = screen.getByRole('button', { name: /gerar qr code/i });

    await user.type(amountInput, '100.50');
    await user.type(descriptionInput, 'Test payment');
    await user.click(generateButton);

    expect(mockOnGenerateQR).toHaveBeenCalledWith('100.50', 'Test payment');
  });
});