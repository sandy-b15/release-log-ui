import { Settings as SettingsIcon, Clock } from 'lucide-react';
import TopBar from '../../components/Header/Header';
import './Settings.css';

const Settings = () => {
    return (
        <>
            <TopBar sub="Settings" title="Preferences" />
            <main className="settings-main">
                <div className="coming-soon-container">
                    <div className="coming-soon-icon">
                        <SettingsIcon size={48} strokeWidth={1.5} />
                    </div>
                    <h1 className="coming-soon-title">Settings</h1>
                    <div className="coming-soon-badge">
                        <Clock size={14} />
                        <span>Coming Soon</span>
                    </div>
                    <p className="coming-soon-desc">
                        We're working on bringing you a powerful settings experience.
                        Stay tuned for account preferences, team management, and more.
                    </p>
                    <div className="coming-soon-features">
                        <div className="feature-preview-card">
                            <span className="feature-dot"></span>
                            Account & Profile
                        </div>
                        <div className="feature-preview-card">
                            <span className="feature-dot"></span>
                            Team Management
                        </div>
                        <div className="feature-preview-card">
                            <span className="feature-dot"></span>
                            Notifications
                        </div>
                        <div className="feature-preview-card">
                            <span className="feature-dot"></span>
                            API Keys
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Settings;
