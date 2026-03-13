import { useState, useRef, useEffect } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';

/**
 * SearchDropdown — a custom dropdown with search, single or multi-select.
 *
 * Props:
 *   options       — [{ id, label, sub? }]
 *   value         — single: id string/number, multi: array of ids
 *   onChange      — single: (id) => void, multi: (ids[]) => void
 *   placeholder   — text when nothing selected
 *   multi         — boolean, enable multi-select
 *   disabled      — boolean
 *   style         — container style override
 */
const SearchDropdown = ({ options = [], value, onChange, placeholder = 'Select...', multi = false, disabled = false, style }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus();
    }, [open]);

    const filtered = options.filter(o =>
        (o.label || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.sub || '').toLowerCase().includes(search.toLowerCase())
    );

    const selectedIds = multi ? (value || []) : (value != null ? [value] : []);
    const isSelected = (id) => selectedIds.includes(id);

    const handleSelect = (id) => {
        if (multi) {
            const next = isSelected(id) ? selectedIds.filter(v => v !== id) : [...selectedIds, id];
            onChange(next);
        } else {
            onChange(id);
            setOpen(false);
            setSearch('');
        }
    };

    // Display label
    let displayLabel = placeholder;
    if (multi && selectedIds.length > 0) {
        if (selectedIds.length === 1) {
            const opt = options.find(o => o.id === selectedIds[0]);
            displayLabel = opt?.label || '1 selected';
        } else {
            displayLabel = `${selectedIds.length} selected`;
        }
    } else if (!multi && value != null) {
        const opt = options.find(o => o.id === value);
        displayLabel = opt?.label || placeholder;
    }

    const isPlaceholder = multi ? selectedIds.length === 0 : value == null || value === '';

    return (
        <div ref={ref} style={{ position: 'relative', minWidth: 150, flex: 1, ...style }}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => { if (!disabled) { setOpen(p => !p); setSearch(''); } }}
                style={{
                    width: '100%', padding: '7px 12px', borderRadius: 8,
                    border: `1px solid ${open ? 'var(--indigo)' : 'var(--border)'}`,
                    fontSize: 14, fontFamily: 'var(--font)',
                    background: 'var(--white)', margin: 0, cursor: disabled ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
                    color: isPlaceholder ? 'var(--muted)' : 'var(--text)',
                    textAlign: 'left', opacity: disabled ? 0.5 : 1,
                    boxShadow: open ? '0 0 0 3px rgba(99, 102, 241, 0.08)' : 'none',
                    transition: 'border-color .15s, box-shadow .15s',
                    minHeight: '40px',
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{displayLabel}</span>
                <ChevronDown size={13} style={{ flexShrink: 0, color: open ? 'var(--indigo)' : 'var(--muted)', transition: 'transform .2s, color .15s', transform: open ? 'rotate(180deg)' : 'none' }} />
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, marginTop: 4,
                    width: '100%', boxSizing: 'border-box',
                    background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10,
                    boxShadow: '0 8px 24px rgba(28, 25, 23, .1)', zIndex: 60, fontFamily: 'var(--font)',
                }}>
                    {/* Search input */}
                    <div style={{ padding: '8px 8px 4px', position: 'relative' }}>
                        <Search size={13} style={{ position: 'absolute', left: 16, top: 25, color: 'var(--muted)', pointerEvents: 'none' }} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '6px 8px 6px 26px', borderRadius: 6,
                                border: '1px solid var(--border-l)', fontSize: 12, fontFamily: 'var(--font)',
                                outline: 'none', boxSizing: 'border-box', color: 'var(--text)',
                                background: 'var(--bg)',
                            }}
                            onFocus={e => { e.target.style.borderColor = 'var(--indigo)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.08)'; }}
                            onBlur={e => { e.target.style.borderColor = 'var(--border-l)'; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>
                    {/* Options */}
                    <div style={{ maxHeight: 200, overflowY: 'auto', padding: '4px 0' }}>
                        {filtered.length === 0 ? (
                            <div style={{ padding: '10px 12px', fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>No results</div>
                        ) : filtered.map(o => {
                            const sel = isSelected(o.id);
                            return (
                                <button
                                    key={o.id}
                                    onClick={() => { if (!o.disabled) handleSelect(o.id); }}
                                    style={{
                                        width: '100%', padding: '7px 12px', display: 'flex', alignItems: 'center',
                                        gap: 8, fontSize: 14, border: 'none',
                                        cursor: o.disabled ? 'not-allowed' : 'pointer',
                                        background: sel ? 'var(--il)' : 'transparent',
                                        color: o.disabled ? 'var(--muted)' : sel ? 'var(--it)' : 'var(--text)',
                                        opacity: o.disabled ? 0.55 : 1,
                                        fontFamily: 'var(--font)', textAlign: 'left',
                                        borderRadius: 0, transition: 'background .1s',
                                    }}
                                    onMouseEnter={e => { if (!sel && !o.disabled) e.currentTarget.style.background = 'var(--s1)'; }}
                                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'transparent'; }}
                                >
                                    {multi && (
                                        <span style={{
                                            width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                                            border: sel ? 'none' : '1.5px solid var(--s2)',
                                            background: sel ? 'var(--indigo)' : 'var(--white)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'background .15s, border .15s',
                                        }}>
                                            {sel && <Check size={10} color="#fff" />}
                                        </span>
                                    )}
                                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {o.label}
                                    </span>
                                    {o.sub && <span style={{ fontSize: 10, color: 'var(--muted)', flexShrink: 0 }}>{o.sub}</span>}
                                    {!multi && sel && <Check size={13} style={{ flexShrink: 0, color: 'var(--indigo)' }} />}
                                </button>
                            );
                        })}
                    </div>
                    {/* Multi: clear/done footer */}
                    {multi && selectedIds.length > 0 && (
                        <div style={{
                            padding: '6px 8px', borderTop: '1px solid var(--border-l)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'var(--bg)',
                        }}>
                            <button
                                onClick={() => { onChange([]); }}
                                style={{ fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', padding: '2px 4px' }}
                            >Clear</button>
                            <button
                                onClick={() => { setOpen(false); setSearch(''); }}
                                style={{ fontSize: 11, color: 'var(--indigo)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', padding: '2px 4px' }}
                            >Done</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;
