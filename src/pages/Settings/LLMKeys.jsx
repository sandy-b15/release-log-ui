import { useState } from 'react';
import { Plus, X, Eye, EyeOff, Key, Shield, Check, Trash2, Loader2, Lock } from 'lucide-react';
import { useLLMKeys } from '../../hooks/useLLMKeys';
import { useEntitlements } from '../../hooks/useEntitlements';
import { providerColors } from './settingsData.jsx';
import SearchDropdown from '../../components/ui/SearchDropdown';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import groqLogo from '../../assets/groq-logo.svg';
import openaiLogo from '../../assets/openai-logo.svg';
import anthropicLogo from '../../assets/anthropic-logo.svg';
import geminiLogo from '../../assets/gemini-logo.svg';
import releaslyLogo from '../../assets/logos/releaslyy-favicon-192.png';

const providerLogos = { releasly: releaslyLogo, groq: groqLogo, openai: openaiLogo, anthropic: anthropicLogo, gemini: geminiLogo };

export default function LLMKeys() {
  const { savedKeys, catalogue, saveKey, removeKey, validateKey, isLoading } = useLLMKeys();
  const { canUse } = useEntitlements();
  const navigate = useNavigate();
  const byokCheck = canUse('byok_enabled');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('groq');
  const [selectedModel, setSelectedModel] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [defaultProvider, setDefaultProvider] = useState(() => {
    const def = savedKeys.find(k => k.isDefault);
    return def?.provider || 'releasly';
  });

  const allProviders = catalogue ? Object.entries(catalogue) : [];
  const userProviders = allProviders.filter(([, config]) => !config.builtin);

  const providerLabelMap = Object.fromEntries(allProviders.map(([key, config]) => [key, config.label]));
  const colorMap = { groq: providerColors.Groq, openai: providerColors.OpenAI, anthropic: providerColors.Anthropic, gemini: providerColors.Gemini };

  const openAddForProvider = (providerKey) => {
    setSelectedProvider(providerKey);
    setSelectedModel('');
    setApiKeyInput('');
    setShowAdd(true);
  };

  const handleSaveKey = async () => {
    if (!apiKeyInput.trim()) return;
    setSaving(true);
    try {
      const model = selectedModel || catalogue?.[selectedProvider]?.defaultModel;
      const validation = await validateKey(selectedProvider, apiKeyInput.trim(), model);
      if (!validation.valid) {
        const providerName = providerLabelMap[selectedProvider] || selectedProvider;
        toast.error(`Invalid ${providerName} API key. Please check and try again.`);
        setSaving(false);
        return;
      }
      await saveKey(selectedProvider, apiKeyInput.trim(), selectedModel || undefined, undefined, false);
      setApiKeyInput('');
      setShowAdd(false);
      toast.success(`${providerLabelMap[selectedProvider]} key saved`);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to save key');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveKey = async (provider) => {
    try {
      await removeKey(provider);
      toast.success('Key removed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove key');
    }
  };

  const handleSaveDefault = async () => {
    // Builtin providers don't need a saved key
    const isBuiltin = catalogue?.[defaultProvider]?.builtin;
    if (!isBuiltin) {
      const existing = savedKeys.find(k => k.provider === defaultProvider);
      if (!existing) {
        toast.error('Save a key for this provider first');
        return;
      }
      try {
        await saveKey(defaultProvider, '__placeholder__', existing.preferredModel, undefined, true);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to set default');
        return;
      }
    }
    toast.success(`${providerLabelMap[defaultProvider]} set as default`);
  };

  // Build key cards — builtin providers are always "connected"
  const keyCards = allProviders.map(([key, config]) => {
    const isBuiltin = !!config.builtin;
    const saved = savedKeys.find(k => k.provider === key);
    return {
      id: key,
      name: config.label,
      masked: isBuiltin ? 'Server-managed' : (saved?.maskedKey || null),
      connected: isBuiltin || !!saved,
      builtin: isBuiltin,
      color: colorMap[key] || 'var(--sky)',
    };
  });

  // Only user-configurable providers in the Add Key dropdown
  const providerOptions = userProviders.map(([key, config]) => ({ id: key, label: config.label }));
  const modelOptions = catalogue?.[selectedProvider]?.models.map(m => ({ id: m.id, label: m.label })) || [];

  if (isLoading) {
    return (
      <div className="tab-content" style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <Loader2 size={24} className="spin" style={{ color: 'var(--muted)' }} />
      </div>
    );
  }

  if (!byokCheck.allowed) {
    return (
      <div className="tab-content">
        <div style={{
          textAlign: 'center', padding: '60px 24px',
          border: '1.5px dashed var(--border)', borderRadius: 'var(--r)',
          background: 'var(--s1)',
        }}>
          <Lock size={32} style={{ color: 'var(--muted)', marginBottom: 12 }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
            Bring Your Own Key is a Pro feature
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
            Upgrade to Pro to use your own API keys from OpenAI, Anthropic, Groq, and Gemini for release note generation.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/pricing')}>
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">

      {/* ── API Keys ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div className="section-title">API Keys</div>
          <div className="section-desc" style={{ marginBottom: 0 }}>Manage your AI provider keys (encrypted with AES-256)</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowAdd(!showAdd); if (showAdd) setApiKeyInput(''); }}>
          {showAdd ? <><X size={13} /> Cancel</> : <><Plus size={13} /> Add Key</>}
        </button>
      </div>

      {showAdd && (
        <div className="s-card" style={{ marginBottom: 20, animation: 'settingsFadeUp 0.25s ease' }}>
          <div className="section-title" style={{ fontSize: 14 }}>Add New Key</div>
          <div className="section-desc">Your key is encrypted and never stored in plain text</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Provider</label>
              <SearchDropdown
                options={providerOptions}
                value={selectedProvider}
                onChange={(id) => { setSelectedProvider(id); setSelectedModel(''); }}
                placeholder="Select provider..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Model</label>
              <SearchDropdown
                options={modelOptions}
                value={selectedModel || modelOptions[0]?.id}
                onChange={(id) => setSelectedModel(id)}
                placeholder="Select model..."
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">API Key</label>
            <div className="input-wrap">
              <input
                className="form-input"
                type={showKey ? 'text' : 'password'}
                placeholder="Paste your API key"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
              />
              <button className="input-toggle" onClick={() => setShowKey(!showKey)}>
                {showKey ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={13} style={{ color: 'var(--m2)' }} />
            <span style={{ fontSize: 12, color: 'var(--m2)' }}>Encrypted with AES-256 before storage</span>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary" onClick={handleSaveKey} disabled={saving || !apiKeyInput.trim()}>
              {saving ? <Loader2 size={14} className="spin" /> : <Key size={14} />}
              Save Key
            </button>
          </div>
        </div>
      )}

      <div className="keys-grid">
        {keyCards.map(k => (
          <div
            className="key-card"
            key={k.id}
            onClick={() => { if (!k.connected && !k.builtin) openAddForProvider(k.id); }}
            style={{ cursor: !k.connected && !k.builtin ? 'pointer' : 'default' }}
          >
            <div className="key-icon" style={{ background: 'var(--s1)', padding: 0, overflow: 'hidden' }}>
              <img src={providerLogos[k.id]} alt={k.name} style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 'var(--rs)' }} />
            </div>
            <div className="key-info">
              <div className="key-name">
                {k.name}
                {k.builtin && <span className="s-badge s-badge-green" style={{ fontSize: 10, marginLeft: 6 }}>Built-in</span>}
              </div>
              {k.connected && !k.builtin && <div className="key-masked">{k.masked}</div>}
              {k.builtin && <div className="key-masked" style={{ color: 'var(--muted)' }}>No API key needed</div>}
              <div className="key-status">
                <span className="status-dot" style={{ background: k.connected ? 'var(--emerald)' : 'var(--s2)' }} />
                <span style={{ color: k.connected ? 'var(--et)' : 'var(--m2)' }}>
                  {k.connected ? (k.builtin ? 'Always available' : 'Connected') : 'Click to configure'}
                </span>
              </div>
            </div>
            {k.connected && !k.builtin && (
              <div className="key-actions">
                <button className="btn btn-icon" style={{ color: 'var(--rose)' }} onClick={(e) => { e.stopPropagation(); handleRemoveKey(k.id); }}>
                  <Trash2 />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="s-divider" />
      {/* ── Default Provider ── */}
      <div style={{ maxWidth: 480, marginBottom: 28 }}>
        <div className="section-title">Default Provider</div>
        <div className="section-desc">Used when generating release notes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {allProviders.map(([key, config]) => {
            const isBuiltin = !!config.builtin;
            const hasSavedKey = isBuiltin || savedKeys.some(k => k.provider === key);
            return (
              <label key={key} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 'var(--rs)',
                border: `1.5px solid ${defaultProvider === key ? 'var(--primary)' : 'var(--border)'}`,
                cursor: hasSavedKey ? 'pointer' : 'not-allowed',
                background: defaultProvider === key ? 'var(--bg)' : 'var(--white)',
                transition: 'all 0.15s',
                opacity: hasSavedKey ? 1 : 0.45,
              }}>
                <input
                  type="radio"
                  name="default-provider"
                  checked={defaultProvider === key}
                  onChange={() => setDefaultProvider(key)}
                  disabled={!hasSavedKey}
                  style={{ accentColor: 'var(--primary)', margin: 0, width: 16, height: 16, flexShrink: 0 }}
                />
                <img src={providerLogos[key]} alt={config.label} style={{ width: 22, height: 22, borderRadius: 5, objectFit: 'contain', flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text)', flex: 1 }}>{config.label}</span>
                {isBuiltin && <span style={{ fontSize: 11, color: 'var(--et)', flexShrink: 0 }}>Free</span>}
                {!isBuiltin && !savedKeys.some(k => k.provider === key) && <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>No key</span>}
              </label>
            );
          })}
        </div>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleSaveDefault}>
          <Check size={14} /> Save Preference
        </button>
      </div>

    </div>
  );
}
