import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import Header from '../Header';

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const HeaderWithBrowserRouter = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

describe('Header', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders header with logo and title', () => {
    render(<HeaderWithBrowserRouter />);
    expect(screen.getByText('Pix Fácil')).toBeInTheDocument();
    expect(screen.getByText('Simplifique seus pagamentos')).toBeInTheDocument();
  });

  it('navigates to dashboard view when home button is clicked (visible em rotas não raiz)', async () => {
    const user = userEvent.setup();
    // Inicia em uma rota diferente de "/" para garantir que o botão Home apareça
    render(
      <MemoryRouter initialEntries={["/historico"]}>
        <Header />
      </MemoryRouter>
    );

    const homeButton = screen.getByRole('button');
    await user.click(homeButton);

    // Verifica que o primeiro argumento da navegação é '/?view=dashboard'
    expect(mockNavigate).toHaveBeenCalled();
    const [firstArg] = mockNavigate.mock.calls[0];
    expect(firstArg).toBe('/?view=dashboard');
  });
});