import { useState } from 'react';
import { User, CreditCard, BarChart3, Key, Link2, FolderOpen } from 'lucide-react';
import TopBar from '../../components/Header/Header';
import BasicInfo from './BasicInfo';
import PlansBilling from './PlansBilling';
import UsageMetrics from './UsageMetrics';
import LLMKeys from './LLMKeys';
import SettingsIntegrations from './SettingsIntegrations';
import SettingsProjects from './SettingsProjects';
import './Settings.css';

const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <User size={15} /> },
    { id: 'projects', label: 'Projects', icon: <FolderOpen size={15} /> },
    { id: 'plans', label: 'Plans & Billing', icon: <CreditCard size={15} /> },
    { id: 'usage', label: 'Usage Metrics', icon: <BarChart3 size={15} /> },
    { id: 'keys', label: 'LLM Keys', icon: <Key size={15} /> },
    { id: 'integrations', label: 'Integrations', icon: <Link2 size={15} /> },
];

const tabContent = {
    basic: BasicInfo,
    projects: SettingsProjects,
    plans: PlansBilling,
    usage: UsageMetrics,
    keys: LLMKeys,
    integrations: SettingsIntegrations,
};

const Settings = () => {
    const [activeTab, setActiveTab] = useState('basic');
    const [animKey, setAnimKey] = useState(0);
    const ActiveComponent = tabContent[activeTab];

    const switchTab = (id) => {
        setActiveTab(id);
        setAnimKey(k => k + 1);
    };

    return (
        <>
            <TopBar sub="Settings" title="Preferences" />
            <div className="settings-root">
                <div className="settings-hdr">
                    <h1>Settings</h1>
                    <p>Manage your account, billing, and preferences</p>
                </div>

                <nav className="tabs-nav">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
                            onClick={() => switchTab(t.id)}
                        >
                            {t.icon}{t.label}
                        </button>
                    ))}
                </nav>

                <ActiveComponent key={animKey} />
            </div>
        </>
    );
};

export default Settings;
