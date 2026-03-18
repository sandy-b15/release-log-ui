import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import TopBar from '../../components/Header/Header';
import api from '../../lib/api';
import './Changelog.css';

const PER_PAGE = 15;

export default function Changelog() {
    const { userId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const fetchPage = useCallback((p) => {
        const isInitial = !data;
        if (isInitial) setLoading(true);
        else setPageLoading(true);

        api.get(`/notes/public/changelog/${userId}`, { params: { page: p, limit: PER_PAGE } })
            .then((res) => {
                setData(res.data);
                setPage(p);
            })
            .catch((err) => {
                const status = err.response?.status;
                if (status === 403) {
                    setError('Changelog page is not available on your current plan.');
                } else if (status === 404) {
                    setError('User not found.');
                } else {
                    setError('Failed to load changelog.');
                }
            })
            .finally(() => {
                setLoading(false);
                setPageLoading(false);
            });
    }, [userId, data]);

    useEffect(() => {
        fetchPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const pagination = data?.pagination;

    return (
        <>
            <TopBar sub="Changelog" title="Public Release Notes" />
            <div className="page-content">
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '80px 0', color: 'var(--muted)' }}>
                        <Loader2 size={28} className="spin" />
                        <span>Loading changelog...</span>
                    </div>
                ) : error ? (
                    <div className="changelog-empty">
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Heading + Description */}
                        <div className="fu changelog-heading">
                            <div>
                                <h2 className="changelog-title">Your Public Release Notes</h2>
                                <p className="changelog-desc">
                                    Release notes you've made public appear here. Share this page with your team, users, or stakeholders to keep them in the loop.
                                </p>
                            </div>
                        </div>

                        {/* Stats + Share */}
                        <div className="fu d1 changelog-stats-row">
                            <div className="changelog-stat">
                                <Globe size={16} style={{ color: 'var(--indigo)' }} />
                                <span className="changelog-stat-num">{pagination?.total || 0}</span>
                                <span className="changelog-stat-label">Public {pagination?.total === 1 ? 'Note' : 'Notes'}</span>
                            </div>
                        </div>

                        {/* Notes List */}
                        {data.notes.length === 0 && page === 1 ? (
                            <div className="changelog-empty">
                                <div className="changelog-empty-icon">
                                    <Globe size={32} />
                                </div>
                                <h3>No public notes yet</h3>
                                <p>To add a note here, open any release note in the editor and toggle it to public.</p>
                            </div>
                        ) : (
                            <>
                                <div className={`changelog-list${pageLoading ? ' changelog-list-loading' : ''}`}>
                                    {data.notes.map((note) => (
                                        <Link
                                            key={note.id}
                                            to={`/n/${note.public_slug}`}
                                            className="changelog-item"
                                        >
                                            <div className="changelog-item-date">
                                                {new Date(note.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </div>
                                            <div className="changelog-item-content">
                                                <h3 className="changelog-item-title">{note.title}</h3>
                                                <div className="changelog-item-meta">
                                                    <span className="changelog-item-badge">{note.source}</span>
                                                    <span className="changelog-item-badge">{note.audience}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination && pagination.totalPages > 1 && (
                                    <div className="changelog-pagination">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            disabled={page <= 1 || pageLoading}
                                            onClick={() => fetchPage(page - 1)}
                                        >
                                            <ChevronLeft size={14} /> Prev
                                        </button>
                                        <span className="changelog-page-info">
                                            Page {page} of {pagination.totalPages}
                                        </span>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            disabled={page >= pagination.totalPages || pageLoading}
                                            onClick={() => fetchPage(page + 1)}
                                        >
                                            Next <ChevronRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
