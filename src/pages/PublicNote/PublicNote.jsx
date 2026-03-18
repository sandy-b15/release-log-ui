import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import './PublicNote.css';
import logo from '../../assets/logos/releaslyy-combined.svg';

const API_URL = import.meta.env.VITE_API_URL;

export default function PublicNote() {
    const { slug } = useParams();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${API_URL}/api/notes/public/${slug}`)
            .then((res) => setNote(res.data))
            .catch((err) => {
                setError(err.response?.status === 404
                    ? 'This release note is private or does not exist.'
                    : 'Failed to load release note.');
            })
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="public-note-loading">
                <Loader2 size={28} className="spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="public-note-error">
                <h2>Not Found</h2>
                <p>{error}</p>
                <a href="https://releaslyy.com" className="public-note-cta">
                    Generate your own release notes &rarr;
                </a>
            </div>
        );
    }

    return (
        <div className="public-note-container">
            <header className="public-note-header">
                <a href="https://releaslyy.com" className="public-note-brand">
                    <img src={logo} alt="Releaslyy" style={{ height: 32 }} />
                </a>
                <span className="public-note-badge">{note.source} &middot; {note.audience}</span>
            </header>
            <article className="public-note-content">
                <h1>{note.title}</h1>
                <div className="public-note-meta">
                    By {note.author_name} &middot; {new Date(note.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="public-note-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
                </div>
            </article>
            <footer className="public-note-footer">
                <p>Generated with <a href="https://releaslyy.com">Releaslyy</a> — AI-powered release notes</p>
            </footer>
        </div>
    );
}
