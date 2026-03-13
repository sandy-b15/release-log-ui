import { useState, useEffect } from 'react';
import { Eye, EyeOff, Settings, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchDropdown from '../ui/SearchDropdown';
import './LLMSelector.css';

export default function LLMSelector({ catalogue, savedKeys, llmConfig, onChange, byokEnabled = true }) {
  const providers = catalogue ? Object.entries(catalogue) : [];
  const selectedProvider = llmConfig.provider || 'releasly';
  const providerConfig = catalogue?.[selectedProvider] || null;
  const isBuiltin = !!providerConfig?.builtin;
  const savedKey = !isBuiltin ? savedKeys.find(k => k.provider === selectedProvider) : null;
  const models = providerConfig?.models || [];
  const [showOverrideKey, setShowOverrideKey] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (isBuiltin) setShowOverrideKey(false);
  }, [isBuiltin]);

  const handleProviderChange = (provider) => {
    const config = catalogue[provider];
    if (config?.builtin) {
      onChange({ provider, model: config.defaultModel, apiKeyOverride: null });
    } else {
      const saved = savedKeys.find(k => k.provider === provider);
      onChange({
        provider,
        model: saved?.preferredModel || config?.defaultModel,
        apiKeyOverride: null,
      });
    }
  };

  return (
    <div className="llm-selector">
      <label className="gen-config-label">AI Model</label>
      <div className="llm-selector-fields">
        <div className="llm-selector-row">
          <SearchDropdown
            options={providers.map(([key, val]) => ({
              id: key,
              label: !val.builtin && !byokEnabled ? `${val.label} (Pro)` : val.label,
              disabled: !val.builtin && !byokEnabled,
            }))}
            value={selectedProvider}
            onChange={handleProviderChange}
            placeholder="Select provider..."
          />
        </div>

        {!isBuiltin && (
          <>
            <div className="llm-selector-row">
              <SearchDropdown
                options={models.map(m => ({ id: m.id, label: m.label }))}
                value={llmConfig.model || providerConfig?.defaultModel}
                onChange={(id) => onChange({ ...llmConfig, model: id })}
                placeholder="Select model..."
              />
            </div>

            {savedKey ? (
              <div className="llm-selector-key-status saved">
                <span className="llm-selector-check">&#10003;</span>
                Using your saved {providerConfig?.label} key ({savedKey.maskedKey})
                <Link to="/settings" className="llm-selector-settings-link">
                  <Settings size={12} /> Settings
                </Link>
              </div>
            ) : (
              <div className="llm-selector-key-status no-key">
                {!showOverrideKey ? (
                  <>
                    <span className="llm-selector-warn">No saved key.</span>
                    <button
                      className="llm-selector-add-key-btn"
                      onClick={() => setShowOverrideKey(true)}
                    >
                      Use a one-time key
                    </button>
                    <span className="llm-selector-or">or</span>
                    <Link to="/settings" className="llm-selector-settings-link">
                      <Settings size={12} /> Add in Settings
                    </Link>
                  </>
                ) : (
                  <div className="llm-selector-override">
                    <div className="llm-key-input-wrap">
                      <input
                        type={showKey ? 'text' : 'password'}
                        className="gen-config-input"
                        placeholder={`Paste ${providerConfig?.label} API key...`}
                        value={llmConfig.apiKeyOverride || ''}
                        onChange={e => onChange({ ...llmConfig, apiKeyOverride: e.target.value })}
                      />
                      <button className="llm-key-eye-btn" onClick={() => setShowKey(!showKey)} type="button">
                        {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <span className="llm-selector-hint">Used for this generation only — not saved.</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {isBuiltin && (
          <div className="llm-selector-key-status default-info">
            Using Releaslyy AI — free, no API key needed. <Link to="/settings" className="llm-selector-settings-link">Add your own key for more control <ExternalLink size={11} /></Link>
          </div>
        )}
      </div>
    </div>
  );
}
