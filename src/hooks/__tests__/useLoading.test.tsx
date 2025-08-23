import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useLoading } from '../useLoading';

describe('useLoading', () => {
  it('should initialize with default loading state', () => {
    const { result } = renderHook(() => useLoading());
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should initialize with custom loading state', () => {
    const { result } = renderHook(() => useLoading(true));
    
    expect(result.current.isLoading).toBe(true);
  });

  it('should handle async operations with withLoading', async () => {
    const { result } = renderHook(() => useLoading());
    const mockAsyncOperation = vi.fn().mockResolvedValue('success');

    await act(async () => {
      await result.current.withLoading(mockAsyncOperation);
    });

    expect(mockAsyncOperation).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle async errors', async () => {
    const { result } = renderHook(() => useLoading());
    const mockAsyncOperation = vi.fn().mockRejectedValue(new Error('Test error'));

    await act(async () => {
      await result.current.withLoading(mockAsyncOperation);
    });

    expect(result.current.error).toBe('Test error');
    expect(result.current.isLoading).toBe(false);
  });
});