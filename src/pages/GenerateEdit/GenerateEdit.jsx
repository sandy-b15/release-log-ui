import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote,
    Code, Minus, Undo2, Redo2, Link as LinkIcon, ChevronDown, FileText, Check, Save
} from 'lucide-react';
import TopBar from '../../components/Header/Header';
import PublishModal from '../../components/PublishModal/PublishModal';
import './GenerateEdit.css';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    withCredentials: true
});

/* ── Micro Icons ── */
const ic = {
    back: <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M11 6.5H2m0 0L5.5 3M2 6.5L5.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    copy: <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 9.5V3a1.5 1.5 0 011.5-1.5H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    dl: <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M6.5 1.5v7m0 0L4 6m2.5 2.5L9 6M2 10v1.5h9V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    send: <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M11.5 1.5L6 7m5.5-5.5l-3.5 11L6 7m5.5-5.5L1 4.5 6 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

// Configure turndown for HTML → Markdown
const turndownService = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
});
turndownService.use(gfm);

// Toolbar button component
const ToolbarButton = ({ onClick, isActive, icon: Icon, title }) => (
    <button
        type="button"
        className={`toolbar-btn ${isActive ? 'active' : ''}`}
        onClick={onClick}
        title={title}
    >
        <Icon size={16} />
    </button>
);

// Toolbar component
const EditorToolbar = ({ editor }) => {
    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl || 'https://');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="editor-toolbar">
            <div className="toolbar-group">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title="Underline" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} title="Strikethrough" />
            </div>
            <div className="toolbar-divider" />
            <div className="toolbar-group">
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} title="Heading 1" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} title="Heading 2" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} title="Heading 3" />
            </div>
            <div className="toolbar-divider" />
            <div className="toolbar-group">
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Numbered List" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title="Blockquote" />
                <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} title="Code Block" />
            </div>
            <div className="toolbar-divider" />
            <div className="toolbar-group">
                <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} icon={LinkIcon} title="Insert Link" />
                <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} isActive={false} icon={Minus} title="Horizontal Rule" />
            </div>
            <div className="toolbar-divider" />
            <div className="toolbar-group">
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} isActive={false} icon={Undo2} title="Undo" />
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} isActive={false} icon={Redo2} title="Redo" />
            </div>
        </div>
    );
};

const GenerateEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [initialHtml, setInitialHtml] = useState('');
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const [mode, setMode] = useState('edit');
    const [noteId, setNoteId] = useState(null);
    const [noteTitle, setNoteTitle] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [isPublished, setIsPublished] = useState(false);

    // Convert incoming markdown to HTML
    useEffect(() => {
        if (location.state?.notes) {
            const html = marked.parse(location.state.notes);
            setInitialHtml(html);
            if (location.state.noteId) setNoteId(location.state.noteId);
            if (location.state.noteTitle) setNoteTitle(location.state.noteTitle);
            if (location.state.published) setIsPublished(true);
        } else {
            navigate('/dashboard');
        }
    }, [location.state, navigate]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.download-wrapper')) {
                setShowDownloadMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4] },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
            }),
            Table.configure({ resizable: false }),
            TableRow,
            TableCell,
            TableHeader,
        ],
        content: initialHtml,
        editorProps: {
            attributes: {
                class: 'tiptap-editor-content',
            },
        },
        onUpdate: () => {
            setHasChanges(true);
            setSaved(false);
        },
    }, [initialHtml]);

    const getMarkdown = () => {
        if (!editor) return '';
        return turndownService.turndown(editor.getHTML());
    };

    const getStyledHtml = () => {
        if (!editor) return '';
        return `
            <html><head><meta charset="utf-8"><style>
                body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.7; padding: 40px; max-width: 900px; margin: 0 auto; }
                h1 { font-size: 1.75rem; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
                h2 { font-size: 1.35rem; color: #0f172a; margin-top: 28px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
                h3 { font-size: 1.1rem; color: #1e293b; margin-top: 20px; }
                p { margin: 0 0 12px; color: #334155; }
                ul, ol { margin: 0 0 12px; padding-left: 24px; }
                li { margin-bottom: 4px; color: #334155; }
                table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 0.9rem; }
                th { padding: 10px 14px; text-align: left; font-weight: 600; color: #0f172a; background: #e2e8f0; border: 1px solid #cbd5e1; }
                td { padding: 10px 14px; border: 1px solid #e2e8f0; color: #334155; vertical-align: top; }
                blockquote { margin: 12px 0; padding: 12px 20px; border-left: 4px solid #00BFA5; background: #eff6ff; color: #003366; }
                code { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; }
                hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
                strong { font-weight: 600; color: #0f172a; }
                a { color: #00BFA5; }
            </style></head><body>${editor.getHTML()}</body></html>`;
    };

    const handleCopy = () => {
        const md = getMarkdown();
        navigator.clipboard.writeText(md);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = useCallback(async () => {
        if (!noteId || !editor) return;
        setSaving(true);
        try {
            const md = turndownService.turndown(editor.getHTML());
            await api.put(`/notes/${noteId}`, { content: md, title: noteTitle || undefined });
            setHasChanges(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
            toast.success('Release notes saved!');
        } catch (err) {
            console.error('Failed to save:', err);
            toast.error('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    }, [noteId, editor, noteTitle]);

    const handlePublish = async () => {
        if (!editor) return;
        if (noteId && hasChanges) {
            await handleSave();
        }
        setShowPublishModal(true);
    };

    const getHtmlContent = useCallback(() => {
        if (!editor) return '';
        return editor.getHTML();
    }, [editor]);

    const getJsonContent = useCallback(() => {
        if (!editor) return null;
        return editor.getJSON();
    }, [editor]);

    const handleDownloadMd = () => {
        const md = getMarkdown();
        const blob = new Blob([md], { type: 'text/markdown' });
        downloadBlob(blob, 'release_notes.md');
        setShowDownloadMenu(false);
    };

    const handleDownloadDoc = () => {
        const html = getStyledHtml();
        const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
        downloadBlob(blob, 'release_notes.doc');
        setShowDownloadMenu(false);
    };

    const handleDownloadPdf = async () => {
        setShowDownloadMenu(false);
        if (!editor) return;
        const html2pdf = (await import('html2pdf.js')).default;

        const container = document.createElement('div');
        container.style.cssText = 'font-family: Segoe UI, Arial, sans-serif; color: #1e293b; line-height: 1.7; padding: 40px; max-width: 900px;';
        container.innerHTML = editor.getHTML();

        container.querySelectorAll('table').forEach(t => {
            t.style.cssText = 'width:100%;border-collapse:collapse;margin:12px 0;font-size:0.9rem;';
        });
        container.querySelectorAll('th').forEach(th => {
            th.style.cssText = 'padding:10px 14px;text-align:left;font-weight:600;background:#e2e8f0;border:1px solid #cbd5e1;';
        });
        container.querySelectorAll('td').forEach(td => {
            td.style.cssText = 'padding:10px 14px;border:1px solid #e2e8f0;vertical-align:top;';
        });
        container.querySelectorAll('h1').forEach(h => {
            h.style.cssText = 'font-size:1.75rem;font-weight:700;border-bottom:2px solid #e2e8f0;padding-bottom:8px;';
        });
        container.querySelectorAll('h2').forEach(h => {
            h.style.cssText = 'font-size:1.35rem;font-weight:600;margin-top:28px;border-bottom:1px solid #f1f5f9;padding-bottom:6px;';
        });

        document.body.appendChild(container);
        await html2pdf().set({
            margin: [10, 10, 10, 10],
            filename: 'release_notes.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        }).from(container).save();
        document.body.removeChild(container);
    };

    const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <TopBar sub="Editor" title="Release Notes">
                <div style={{ display: 'flex', gap: 6 }}>
                    <button className="topbar-action-btn" onClick={() => navigate('/dashboard')}>
                        {ic.back} Back
                    </button>
                    <div className="download-wrapper">
                        <button className="topbar-action-btn" onClick={() => setShowDownloadMenu(!showDownloadMenu)}>
                            {ic.dl} Export
                            <ChevronDown size={12} style={{ transition: 'transform .2s', transform: showDownloadMenu ? 'rotate(180deg)' : 'none' }} />
                        </button>
                        {showDownloadMenu && (
                            <div className="download-options-v2">
                                <button className="download-option-v2" onClick={handleDownloadMd}>
                                    <FileText size={14} /> Markdown (.md)
                                </button>
                                <button className="download-option-v2" onClick={handleDownloadDoc}>
                                    <FileText size={14} /> Word (.doc)
                                </button>
                                <button className="download-option-v2" onClick={handleDownloadPdf}>
                                    <FileText size={14} /> PDF (.pdf)
                                </button>
                            </div>
                        )}
                    </div>
                    <button className={`editor-publish-btn ${isPublished ? 'published' : ''}`} onClick={handlePublish} disabled={saving}>
                        {isPublished ? <><Check size={13} /> Published</> : <>{ic.send} Publish</>}
                    </button>
                </div>
            </TopBar>
            <div style={{ padding: '20px 32px' }}>
                {/* Mode toggle + Copy */}
                <div className="fu editor-mode-row">
                    <div className="editor-mode-toggle">
                        {['edit', 'preview'].map(m => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`editor-mode-btn ${mode === m ? 'active' : ''}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button className="topbar-action-btn" onClick={handleCopy}>
                            {copied ? <><Check size={13} /> Copied</> : <>{ic.copy} Copy</>}
                        </button>
                        {noteId && (
                            <button className="topbar-action-btn" onClick={handleSave} disabled={saving || !hasChanges}>
                                {saving ? 'Saving...' : saved ? <><Check size={13} /> Saved</> : <><Save size={13} /> Save</>}
                            </button>
                        )}
                    </div>
                </div>

                <div className="fu d1 editor-card">
                    {mode === 'edit' && <EditorToolbar editor={editor} />}
                    <div className="editor-body">
                        <EditorContent editor={editor} />
                    </div>
                </div>
            </div>
            <PublishModal
                open={showPublishModal}
                onClose={(didPublish) => {
                    setShowPublishModal(false);
                    if (didPublish) setIsPublished(true);
                }}
                noteId={noteId}
                noteTitle={noteTitle}
                getHtmlContent={getHtmlContent}
                getJsonContent={getJsonContent}
                isPublished={isPublished}
            />
        </>
    );
};

export default GenerateEdit;
