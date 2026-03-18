import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

// Mock api
vi.mock('../../src/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

import { useLLMKeys } from '../../src/hooks/useLLMKeys';
import api from '../../src/lib/api';

describe('useLLMKeys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockImplementation((url) => {
      if (url === '/user/llm-keys') {
        return Promise.resolve({
          data: [
            { provider: 'openai', label: 'My OpenAI', isDefault: true },
            { provider: 'anthropic', label: 'Claude', isDefault: false },
          ],
        });
      }
      if (url === '/llm/catalogue') {
        return Promise.resolve({
          data: [
            { provider: 'openai', name: 'OpenAI', models: ['gpt-4'] },
            { provider: 'anthropic', name: 'Anthropic', models: ['claude-3'] },
          ],
        });
      }
      return Promise.resolve({ data: {} });
    });
  });

  it('should fetch keys and catalogue on mount', async () => {
    const { result } = renderHook(() => useLLMKeys());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/user/llm-keys');
    expect(api.get).toHaveBeenCalledWith('/llm/catalogue');
    expect(result.current.savedKeys).toHaveLength(2);
    expect(result.current.catalogue).toHaveLength(2);
  });

  it('should compute defaultProvider from saved keys', async () => {
    const { result } = renderHook(() => useLLMKeys());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.defaultProvider).toBe('openai');
  });

  it('should return null defaultProvider when no key is default', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/user/llm-keys') {
        return Promise.resolve({
          data: [{ provider: 'openai', isDefault: false }],
        });
      }
      if (url === '/llm/catalogue') return Promise.resolve({ data: [] });
      return Promise.resolve({ data: {} });
    });

    const { result } = renderHook(() => useLLMKeys());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.defaultProvider).toBeNull();
  });

  it('should handle fetch keys error gracefully', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/user/llm-keys') return Promise.reject(new Error('Network error'));
      if (url === '/llm/catalogue') return Promise.resolve({ data: [] });
      return Promise.resolve({ data: {} });
    });

    const { result } = renderHook(() => useLLMKeys());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
  });

  it('should save a key via API', async () => {
    api.post.mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => useLLMKeys());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.saveKey('openai', 'sk-123', 'gpt-4', 'My Key', true);
    });

    expect(api.post).toHaveBeenCalledWith('/user/llm-keys', {
      provider: 'openai',
      apiKey: 'sk-123',
      preferredModel: 'gpt-4',
      label: 'My Key',
      isDefault: true,
    });
  });

  it('should remove a key via API', async () => {
    api.delete.mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useLLMKeys());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.removeKey('openai');
    });

    expect(api.delete).toHaveBeenCalledWith('/user/llm-keys/openai');
  });

  it('should validate a key via API', async () => {
    api.post.mockResolvedValue({ data: { valid: true } });

    const { result } = renderHook(() => useLLMKeys());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let validation;
    await act(async () => {
      validation = await result.current.validateKey('openai', 'sk-123', 'gpt-4');
    });

    expect(api.post).toHaveBeenCalledWith('/user/llm-keys/validate', {
      provider: 'openai',
      apiKey: 'sk-123',
      model: 'gpt-4',
    });
    expect(validation).toEqual({ valid: true });
  });

  it('should refetch keys', async () => {
    const { result } = renderHook(() => useLLMKeys());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialCallCount = api.get.mock.calls.filter(c => c[0] === '/user/llm-keys').length;

    await act(async () => {
      await result.current.refetch();
    });

    const afterRefetchCount = api.get.mock.calls.filter(c => c[0] === '/user/llm-keys').length;
    expect(afterRefetchCount).toBe(initialCallCount + 1);
  });
});
