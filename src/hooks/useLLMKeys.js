import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = `${import.meta.env.VITE_API_URL}/api`;

export function useLLMKeys() {
  const [savedKeys, setSavedKeys] = useState([]);
  const [catalogue, setCatalogue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/user/llm-keys`, { withCredentials: true });
      setSavedKeys(res.data);
    } catch (err) {
      console.error('Failed to fetch LLM keys:', err);
      setError(err.message);
      toast.error(err.response?.data?.error || 'Failed to load API keys');
    }
  }, []);

  const fetchCatalogue = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/llm/catalogue`);
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
    const res = await axios.post(`${API}/user/llm-keys`, {
      provider, apiKey, preferredModel, label, isDefault,
    }, { withCredentials: true });
    await fetchKeys();
    return res.data;
  }, [fetchKeys]);

  const removeKey = useCallback(async (provider) => {
    await axios.delete(`${API}/user/llm-keys/${provider}`, { withCredentials: true });
    await fetchKeys();
  }, [fetchKeys]);

  const validateKey = useCallback(async (provider, apiKey, model) => {
    const res = await axios.post(`${API}/user/llm-keys/validate`, {
      provider, apiKey, model,
    }, { withCredentials: true });
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
