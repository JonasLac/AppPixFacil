import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { describe, it, expect } from 'vitest';
import { LoadingButton } from '../loading-button';

describe('LoadingButton', () => {
  it('renders button in normal state', () => {
    render(<LoadingButton>Submit</LoadingButton>);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows loading state correctly', () => {
    render(<LoadingButton loading loadingText="Processing...">Submit</LoadingButton>);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows spinner when loading', () => {
    render(<LoadingButton loading>Submit</LoadingButton>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});