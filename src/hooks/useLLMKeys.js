import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';

export function useLLMKeys() {
  const [savedKeys, setSavedKeys] = useState([]);
  const [catalogue, setCatalogue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await api.get('/user/llm-keys');
      setSavedKeys(res.data);
    } catch (err) {
      console.error('Failed to fetch LLM keys:', err);
      setError(err.message);
      toast.error(err.response?.data?.error || 'Failed to load API keys');
    }
  }, []);

  const fetchCatalogue = useCallback(async () => {
    try {
      const res = await api.get('/llm/catalogue');
      setCatalogue(res.data);
    } catch (err) {
      console.error('Failed to fetch LLM catalogue:', err);
      setError(err.message);
      toast.error(err.response?.data?.error || 'Failed to load LLM providers');
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchKeys(), fetchCatalogue()]).finally(() => setIsLoading(false));
  }, [fetchKeys, fetchCatalogue]);

  const defaultProvider = savedKeys.find(k => k.isDefault)?.provider || null;

  const saveKey = useCallback(async (provider, apiKey, preferredModel, label, isDefault) => {
    const res = await api.post('/user/llm-keys', {
      provider, apiKey, preferredModel, label, isDefault,
    });
    await fetchKeys();
    return res.data;
  }, [fetchKeys]);

  const removeKey = useCallback(async (provider) => {
    await api.delete(`/user/llm-keys/${provider}`);
    await fetchKeys();
  }, [fetchKeys]);

  const validateKey = useCallback(async (provider, apiKey, model) => {
    const res = await api.post('/user/llm-keys/validate', {
      provider, apiKey, model,
    });
    return res.data;
  }, []);

  return {
    savedKeys,
    catalogue,
    defaultProvider,
    saveKey,
    removeKey,
    validateKey,
    isLoading,
    error,
    refetch: fetchKeys,
  };
}
