import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import api from '../../lib/api';

export default function SettingsProjects() {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const [projRes, activeRes] = await Promise.all([
        api.get('/projects'),
        api.get('/projects/active'),
      ]);
      setProjects(projRes.data.projects || []);
      setActiveProjectId(activeRes.data.project?.id || null);
    } catch (err) {
      toast.error('Failed to load projects');
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await api.post('/projects', { name: newName.trim(), description: newDesc.trim() || undefined });
      setProjects(prev => [...prev, res.data.project]);
      setNewName('');
      setNewDesc('');
      setCreating(false);
      toast.success('Project created');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
    }
    setSaving(false);
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    setEditSaving(true);
    try {
      const res = await api.put(`/projects/${id}`, { name: editName.trim(), description: editDesc.trim() || undefined });
      setProjects(prev => prev.map(p => p.id === id ? res.data.project : p));
      setEditingId(null);
      toast.success('Project updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update project');
    }
    setEditSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/projects/${deleteTarget.id}`);
      setProjects(prev => prev.filter(p => p.id !== deleteTarget.id));
      if (activeProjectId === deleteTarget.id) setActiveProjectId(null);
      setDeleteTarget(null);
      toast.success('Project deleted');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete project');
    }
    setDeleting(false);
  };

  const handleSetActive = async (project) => {
    try {
      await api.post('/projects/active', { projectId: project.id });
      setActiveProjectId(project.id);
      toast.success(`Switched to ${project.name}`);
    } catch (err) {
      toast.error('Failed to switch project');
    }
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setEditName(project.name);
    setEditDesc(project.description || '');
  };

  if (loading) {
    return (
      <div className="tab-content" style={{ textAlign: 'center', padding: 60 }}>
        <Loader2 size={24} className="spin" style={{ color: 'var(--muted)' }} />
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="s-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 className="section-title">Projects</h3>
            <p className="section-desc">Organize your release notes by project</p>
          </div>
          {!creating && (
            <button className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>
              <Plus size={15} /> New Project
            </button>
          )}
        </div>

        {creating && (
          <div className="s-card" style={{ marginBottom: 20, background: 'var(--bg)' }}>
            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input
                className="form-input"
                placeholder="e.g. My App v2"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Description (optional)</label>
              <input
                className="form-input"
                placeholder="Brief description"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={saving || !newName.trim()}>
                {saving ? <Loader2 size={14} className="spin" /> : 'Create'}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => { setCreating(false); setNewName(''); setNewDesc(''); }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
            <FolderOpen size={32} style={{ marginBottom: 8, opacity: 0.5 }} />
            <p style={{ fontSize: '1rem' }}>No projects yet. Create one to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {projects.map(project => (
              <div
                key={project.id}
                className="s-card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  border: activeProjectId === project.id ? '1.5px solid var(--indigo)' : undefined,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: activeProjectId === project.id ? 'var(--il)' : 'var(--s1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, color: activeProjectId === project.id ? 'var(--indigo)' : 'var(--muted)',
                }}>
                  <FolderOpen size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {editingId === project.id ? (
                    <div>
                      <input
                        className="form-input"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleUpdate(project.id)}
                        style={{ marginBottom: 8 }}
                      />
                      <input
                        className="form-input"
                        value={editDesc}
                        onChange={e => setEditDesc(e.target.value)}
                        placeholder="Description (optional)"
                        onKeyDown={e => e.key === 'Enter' && handleUpdate(project.id)}
                        style={{ marginBottom: 8 }}
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(project.id)} disabled={editSaving || !editName.trim()}>
                          {editSaving ? <Loader2 size={14} className="spin" /> : 'Save'}
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{project.name}</span>
                        {activeProjectId === project.id && (
                          <span className="s-badge s-badge-green">Active</span>
                        )}
                      </div>
                      {project.description && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', margin: '4px 0 0' }}>{project.description}</p>
                      )}
                    </>
                  )}
                </div>
                {editingId !== project.id && (
                  <div style={{ display: 'flex', gap: 4 }}>
                    {activeProjectId !== project.id && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleSetActive(project)}>
                        Set Active
                      </button>
                    )}
                    <button className="btn btn-icon" onClick={() => startEdit(project)} title="Edit">
                      <Pencil size={15} />
                    </button>
                    <button className="btn btn-icon" onClick={() => setDeleteTarget(project)} title="Delete" style={{ color: 'var(--rose)' }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Release notes in this project will not be deleted, but they will be unlinked from the project.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
