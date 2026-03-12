import { useState } from 'react';
import { Check, X, Loader2, ExternalLink, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LLMKeyCard({ provider, config, savedKey, models, onSave, onRemove, onValidate }) {
  const [apiKey, setApiKey] = useState('');
  const [preferredModel, setPreferredModel] = useState(config.defaultModel);
  const [label, setLabel] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const hasSaved = !!savedKey;

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }
    setSaving(true);
    try {
      await onSave(provider, apiKey.trim(), preferredModel, label || `${config.label} Key`, isDefault);
      setApiKey('');
      toast.success(`${config.label} key saved`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save key');
    } finally {
      setSaving(false);
    }
  };

  const handleValidate = async () => {
    const keyToValidate = hasSaved ? null : apiKey.trim();
    if (!hasSaved && !keyToValidate) {
      toast.error('Enter a key first');
      return;
    }
    setValidating(true);
    try {
      // For saved keys we can't validate from frontend (we don't have the raw key)
      // The validate endpoint needs a raw key, so only works for new keys
      if (!hasSaved) {
        const result = await onValidate(provider, keyToValidate, preferredModel);
        if (result.valid) {
          toast.success('Key is valid!');
        } else {
          toast.error(result.error || 'Key is invalid');
        }
      }
    } catch (err) {
      toast.error('Validation failed');
    } finally {
      setValidating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await onRemove(provider);
      toast.success(`${config.label} key removed`);
    } catch {
      toast.error('Failed to remove key');
    }
  };

  return (
    <div className="llm-key-card" data-connected={hasSaved}>
      <div className="llm-key-header">
        <div className="llm-key-status">
          <span className={`llm-key-dot ${hasSaved ? 'connected' : ''}`} />
          <span className="llm-key-provider">{config.label}</span>
        </div>
        {savedKey?.isDefault && (
          <span className="llm-key-default-badge">
            <Star size={12} /> Default
          </span>
        )}
      </div>

      {hasSaved ? (
        <div className="llm-key-saved">
          <div className="llm-key-info">
            <span className="llm-key-masked">{savedKey.maskedKey}</span>
            {savedKey.preferredModel && (
              <span className="llm-key-model">Preferred: {models?.find(m => m.id === savedKey.preferredModel)?.label || savedKey.preferredModel}</span>
            )}
          </div>
          <div className="llm-key-actions">
            <button className="llm-key-action-btn danger" onClick={handleRemove} title="Remove key">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="llm-key-form">
          <div className="llm-key-input-row">
            <div className="llm-key-input-wrap">
              <input
                type={showKey ? 'text' : 'password'}
                className="llm-key-input"
                placeholder={`Paste ${config.label} API key...`}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
              />
              <button className="llm-key-eye-btn" onClick={() => setShowKey(!showKey)} type="button">
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="llm-key-input-row">
            <select
              className="llm-key-select"
              value={preferredModel}
              onChange={e => setPreferredModel(e.target.value)}
            >
              {models?.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="llm-key-input-row llm-key-btn-row">
            <label className="llm-key-default-check">
              <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} />
              Set as default
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {apiKey && (
                <button className="llm-key-btn secondary" onClick={handleValidate} disabled={validating}>
                  {validating ? <Loader2 size={13} className="spin" /> : <Check size={13} />}
                  Test
                </button>
              )}
              <button className="llm-key-btn primary" onClick={handleSave} disabled={saving || !apiKey.trim()}>
                {saving ? <Loader2 size={13} className="spin" /> : null}
                Save
              </button>
            </div>
          </div>
          <a className="llm-key-docs-link" href={config.docsUrl} target="_blank" rel="noopener noreferrer">
            Get key at {config.docsUrl.replace('https://', '').split('/')[0]} <ExternalLink size={11} />
          </a>
        </div>
      )}
    </div>
  );
}
