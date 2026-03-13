import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const EntitlementsContext = createContext(null);

export function EntitlementsProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEntitlements = useCallback(async () => {
    try {
      const { data: result } = await api.get('/plans/my-entitlements');
      setData(result);
    } catch {
      // User might not be logged in — fail silently
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntitlements();
  }, [fetchEntitlements]);

  /**
   * Check if the user can use a feature.
   * @param {string} featureKey - The entitlement key to check
   * @param {*} value - For array entitlements, the specific value to check membership of
   * @returns {{ allowed: boolean, limit: number|null, used: number|null, requiredPlan: string|null }}
   */
  const canUse = useCallback((featureKey, value) => {
    if (!data?.entitlements) {
      return { allowed: false, limit: null, used: null, requiredPlan: 'pro' };
    }

    const ent = data.entitlements[featureKey];

    // Undefined feature → allowed by default
    if (ent === undefined) {
      return { allowed: true, limit: null, used: null, requiredPlan: null };
    }

    // Boolean
    if (typeof ent === 'boolean') {
      return { allowed: ent, limit: null, used: null, requiredPlan: ent ? null : 'pro' };
    }

    // Array
    if (Array.isArray(ent)) {
      if (ent.includes('*')) return { allowed: true, limit: null, used: null, requiredPlan: null };
      const allowed = !value || ent.includes(value);
      return { allowed, limit: null, used: null, requiredPlan: allowed ? null : 'pro' };
    }

    // Numeric
    if (typeof ent === 'number') {
      if (ent === -1) return { allowed: true, limit: -1, used: null, requiredPlan: null };

      // Map feature key to usage counter
      const usageMap = {
        max_generations_per_month: data.usage?.generations_this_month || 0,
        max_projects: data.usage?.projects_count || 0,
      };
      const used = usageMap[featureKey] || 0;
      return { allowed: used < ent, limit: ent, used, requiredPlan: used >= ent ? 'pro' : null };
    }

    return { allowed: true, limit: null, used: null, requiredPlan: null };
  }, [data]);

  const value = {
    plan: data?.plan || null,
    entitlements: data?.entitlements || {},
    usage: data?.usage || {},
    subscription: data?.subscription || {},
    isExpiringSoon: data?.isExpiringSoon || false,
    daysRemaining: data?.daysRemaining,
    isGracePeriod: data?.isGracePeriod || false,
    loading,
    canUse,
    refetch: fetchEntitlements,
  };

  return (
    <EntitlementsContext.Provider value={value}>
      {children}
    </EntitlementsContext.Provider>
  );
}

export function useEntitlements() {
  const ctx = useContext(EntitlementsContext);
  if (!ctx) {
    // Return safe defaults if called outside provider (e.g. during SSR or on public routes)
    return {
      plan: null,
      entitlements: {},
      usage: {},
      subscription: {},
      isExpiringSoon: false,
      daysRemaining: null,
      isGracePeriod: false,
      loading: true,
      canUse: () => ({ allowed: true, limit: null, used: null, requiredPlan: null }),
      refetch: () => {},
    };
  }
  return ctx;
}
