import { useState, useEffect, useRef } from 'react';
import { Camera, Check, Lock, Eye, EyeOff, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import SearchDropdown from '../../components/ui/SearchDropdown';
import api from '../../lib/api';

export default function BasicInfo() {
  const [profile, setProfile] = useState({ name: '', email: '', company: '', role: '', avatar: '' });
  const [hasPassword, setHasPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/user/profile');
        setProfile({
          name: data.name || '',
          email: data.email || '',
          company: data.company || '',
          role: data.role || '',
          avatar: data.avatar || '',
        });
        setHasPassword(data.hasPassword);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to load profile');
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfile(p => ({ ...p, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/user/profile', {
        name: profile.name,
        email: profile.email,
        company: profile.company,
        role: profile.role,
        avatar: profile.avatar,
      });
      setProfile({
        name: data.name || '',
        email: data.email || '',
        company: data.company || '',
        role: data.role || '',
        avatar: data.avatar || '',
      });
      toast.success('Profile saved');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (pwForm.newPw !== pwForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (pwForm.newPw.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setPwSaving(true);
    try {
      await api.put('/user/password', {
        currentPassword: hasPassword ? pwForm.current : undefined,
        newPassword: pwForm.newPw,
      });
      toast.success(hasPassword ? 'Password updated' : 'Password set');
      setHasPassword(true);
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password');
    } finally {
      setPwSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete('/user/account');
      toast.success('Account deleted');
      window.location.href = '/';
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete account');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="tab-content" style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <Loader2 size={24} className="spin" style={{ color: 'var(--muted)' }} />
      </div>
    );
  }

  const pwFields = hasPassword
    ? [
        { key: 'current', label: 'Current Password' },
        { key: 'newPw', label: 'New Password' },
        { key: 'confirm', label: 'Confirm Password' },
      ]
    : [
        { key: 'newPw', label: 'New Password' },
        { key: 'confirm', label: 'Confirm Password' },
      ];

  return (
    <div className="tab-content" style={{ maxWidth: 640 }}>
      {/* Profile */}
      <div className="s-card" style={{ marginBottom: 20 }}>
        <div className="section-title">Profile</div>
        <div className="section-desc">Your personal information and preferences</div>
        <div
          className="avatar-upload"
          onClick={() => fileRef.current?.click()}
          style={{
            backgroundImage: profile.avatar ? `url(${profile.avatar})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!profile.avatar && <Camera size={22} color="#a8a29e" />}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} style={{ paddingRight: 80 }} />
              <span className="s-badge s-badge-green" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>Verified</span>
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Company</label>
            <input className="form-input" placeholder="Your organization" value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <SearchDropdown
              options={[
                { id: 'Founder', label: 'Founder' },
                { id: 'Product Manager', label: 'Product Manager' },
                { id: 'Engineer', label: 'Engineer' },
                { id: 'Designer', label: 'Designer' },
                { id: 'Other', label: 'Other' },
              ]}
              value={profile.role || ''}
              onChange={(id) => setProfile(p => ({ ...p, role: id }))}
              placeholder="Select a role"
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
          {saving ? <Loader2 size={14} className="spin" /> : <Check size={14} />} Save Changes
        </button>
      </div>

      {/* Password */}
      <div className="s-card" style={{ marginBottom: 20 }}>
        <div className="section-title">Password</div>
        <div className="section-desc">
          {hasPassword ? 'Update your account password' : 'Set a password for your account (currently using Google sign-in only)'}
        </div>
        {pwFields.map(({ key, label }) => (
          <div className="form-group" key={key}>
            <label className="form-label">{label}</label>
            <div className="input-wrap">
              <input
                className="form-input"
                type={showPw[key] ? 'text' : 'password'}
                placeholder="••••••••"
                value={pwForm[key]}
                onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
              />
              <button className="input-toggle" onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}>
                {showPw[key] ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
        ))}
        <button className="btn btn-primary" onClick={handlePasswordUpdate} disabled={pwSaving || !pwForm.newPw}>
          {pwSaving ? <Loader2 size={14} className="spin" /> : <Lock size={14} />}
          {hasPassword ? ' Update Password' : ' Set Password'}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="s-card danger-zone">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <AlertTriangle size={16} color="#dc2626" />
          <div className="section-title" style={{ marginBottom: 0, color: '#dc2626' }}>Danger Zone</div>
        </div>
        <p style={{ fontSize: 13, color: '#78716c', marginBottom: 16 }}>
          This action is irreversible. All your data, release notes, and integrations will be permanently deleted.
        </p>
        {!showDeleteConfirm ? (
          <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 size={14} /> Delete Account
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-danger" onClick={handleDeleteAccount} disabled={deleting}>
              {deleting ? <Loader2 size={14} className="spin" /> : <Trash2 size={14} />} Yes, Delete Everything
            </button>
            <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
