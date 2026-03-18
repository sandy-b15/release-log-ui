import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createElement } from 'react';

// Mock api
vi.mock('../../src/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

import { EntitlementsProvider, useEntitlements } from '../../src/hooks/useEntitlements';
import api from '../../src/lib/api';

function wrapper({ children }) {
  return createElement(EntitlementsProvider, null, children);
}

describe('useEntitlements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return safe defaults when used outside provider', () => {
    const { result } = renderHook(() => useEntitlements());
    expect(result.current.plan).toBeNull();
    expect(result.current.entitlements).toEqual({});
    expect(result.current.usage).toEqual({});
    expect(result.current.loading).toBe(true);
    expect(result.current.canUse('any_feature')).toEqual({
      allowed: true,
      limit: null,
      used: null,
      requiredPlan: null,
    });
  });

  it('should fetch entitlements on mount', async () => {
    api.get.mockResolvedValue({
      data: {
        plan: { slug: 'pro', name: 'Pro' },
        entitlements: { max_generations_per_month: 100 },
        usage: { generations_this_month: 5 },
        subscription: { status: 'active' },
      },
    });

    const { result } = renderHook(() => useEntitlements(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/plans/my-entitlements');
    expect(result.current.plan).toEqual({ slug: 'pro', name: 'Pro' });
    expect(result.current.entitlements).toEqual({ max_generations_per_month: 100 });
  });

  it('should handle API failure gracefully', async () => {
    api.get.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useEntitlements(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.plan).toBeNull();
    expect(result.current.entitlements).toEqual({});
  });

  describe('canUse', () => {
    it('should return allowed=true for boolean entitlement that is true', async () => {
      api.get.mockResolvedValue({
        data: {
          plan: { slug: 'pro' },
          entitlements: { custom_prompts: true },
          usage: {},
        },
      });

      const { result } = renderHook(() => useEntitlements(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      const check = result.current.canUse('custom_prompts');
      expect(check.allowed).toBe(true);
    });

    it('should return allowed=false for boolean entitlement that is false', async () => {
      api.get.mockResolvedValue({
        data: {
          plan: { slug: 'free' },
          entitlements: { custom_prompts: false },
          usage: {},
        },
      });

      const { result } = renderHook(() => useEntitlements(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      const check = result.current.canUse('custom_prompts');
      expect(check.allowed).toBe(false);
      expect(check.requiredPlan).toBe('pro');
    });

    it('should return allowed=true for numeric entitlement when usage is below limit', async () => {
      api.get.mockResolvedValue({
        data: {
          plan: { slug: 'pro' },
          entitlements: { max_generations_per_month: 100 },
          usage: { generations_this_month: 50 },
        },
      });

      const { result } = renderHook(() => useEntitlements(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      const check = result.current.canUse('max_generations_per_month');
      expect(check.allowed).toBe(true);
      expect(check.limit).toBe(100);
      expect(check.used).toBe(50);
    });

    it('should return allowed=false for numeric entitlement when usage exceeds limit', async () => {
      api.get.mockResolvedValue({
        data: {
          plan: { slug: 'free' },
          entitlements: { max_generations_per_month: 5 },
          usage: { generations_this_month: 5 },
        },
      });

      const { result } = renderHook(() => useEntitlements(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      const check = result.current.canUse('max_generations_per_month');
      expect(check.allowed).toBe(false);
      expect(check.requiredPlan).toBe('pro');
    });

    it('should return allowed=true for unlimited numeric entitlement (-1)', async () => {
      api.get.mockResolvedValue({
        data: {
          plan: { slug: 'enterprise' },
          entitlements: { max_generations_per_month: -1 },
          usage: { generations_this_month: 999 },
        },
      });

      const { result } = renderHook(() => useEntitlements(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      const check = result.current.canUse('max_generations_per_month');
      expect(check.allowed).toBe(true);
      expect(check.limit).toBe(-1);
    });

    it('should return allowed=true for array entitlement with wildcard', async () => {
      api.get.mockResolvedValue({
        data: {
          plan: { slug: 'pro' },
          entitlements: { llm_providers: ['*'] },
          usage: {},
        },
      });

      const { result } = renderHook(() => useEntitlements(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      const check = result.current.canUse('llm_providers', 'openai');
      expect(check.allowed).toBe(true);
    });

    it('should return allowed=false for array entitlement when value not included', async () => {
      api.get.mockResolvedValue({
        data: {
          plan: { slug: 'free' },
          entitlements: { llm_providers: ['groq'] },
          usage: {},
        },
      });

      const { result } = renderHook(() => useEntitlements(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      const check = result.current.canUse('llm_providers', 'openai');
      expect(check.allowed).toBe(false);
      expect(check.requiredPlan).toBe('pro');
    });

    it('should return allowed=true for undefined feature key', async () => {
      api.get.mockResolvedValue({
        data: {
          plan: { slug: 'pro' },
          entitlements: {},
          usage: {},
        },
      });

      const { result } = renderHook(() => useEntitlements(), { wrapper });
      await waitFor(() => expect(result.current.loading).toBe(false));

      const check = result.current.canUse('nonexistent_feature');
      expect(check.allowed).toBe(true);
    });
  });

  it('should support refetch', async () => {
    api.get.mockResolvedValue({
      data: {
        plan: { slug: 'free' },
        entitlements: {},
        usage: {},
      },
    });

    const { result } = renderHook(() => useEntitlements(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(api.get).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });

    expect(api.get).toHaveBeenCalledTimes(2);
  });
});
