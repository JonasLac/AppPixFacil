import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
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

const HeaderWithRouter = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
);

describe('Header', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders header with logo and title', () => {
    render(<HeaderWithRouter />);
    
    expect(screen.getByText('Pix Fácil')).toBeInTheDocument();
    expect(screen.getByText('Simplifique seus pagamentos')).toBeInTheDocument();
  });

  it('navigates to home when home button is clicked', async () => {
    const user = userEvent.setup();
    render(<HeaderWithRouter />);
    
    const homeButton = screen.getByRole('button');
    await user.click(homeButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});