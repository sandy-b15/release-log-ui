import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Github,
    Database,
    Cpu,
    Mail,
    Globe,
    CheckCircle2,
    ArrowRight,
    Zap,
    ExternalLink,
    MessageSquare
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        From Commits to Customers, <span className="text-gradient">in seconds.</span>
                    </h1>
                    <p className="hero-subtitle">
                        AI-powered release notes, tailored for every audience. Fetch PRs, generate summaries, and distribute to stakeholders instantly.
                    </p>
                    <div className="hero-actions">
                        <button className="btn-primary btn-lg" onClick={() => navigate('/login')}>Get Started for Free <ArrowRight size={18} /></button>
                    </div>

                    <div className="hero-visual">
                        <div className="source-icons">
                            <Github size={40} className="icon-github" />
                            <div className="connection-line"></div>
                            <Cpu size={48} className="icon-ai" />
                            <div className="connection-line"></div>
                            <div className="destination-icons">
                                <Mail size={32} />
                                <Globe size={32} />
                                <MessageSquare size={32} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="features-grid" id="features">

                {/* Card 1: Connect Tools */}
                <div className="feature-card wide">
                    <div className="card-text">
                        <h3>Connect Your Tools</h3>
                        <p>Source of Truth: Fetch commits, PRs, and tickets automatically from GitHub, Jira, and more.</p>
                    </div>
                    <div className="mockup-ui integration-hub">
                        <div className="mock-card active">
                            <Github size={24} /> <span>GitHub</span>
                            <span className="status">Connected</span>
                        </div>
                        <div className="mock-card disabled">
                            <Database size={24} /> <span>Jira</span>
                            <button className="btn-xs">Connect</button>
                        </div>
                    </div>
                </div>

                {/* Card 2: AI-Powered */}
                <div className="feature-card">
                    <div className="card-text">
                        <h3>AI-Powered, Human-Refined</h3>
                        <p>Generate Technical, Stakeholder, or Public notes in one click with tone control.</p>
                    </div>
                    <div className="mockup-ui editor-preview">
                        <div className="audience-tabs">
                            <span className="tab active">Technical</span>
                            <span className="tab">Stakeholder</span>
                        </div>
                        <div className="text-lines">
                            <div className="line long"></div>
                            <div className="line med"></div>
                            <div className="line short"></div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Automate Release */}
                <div className="feature-card">
                    <div className="card-text">
                        <h3>Automate Your Release</h3>
                        <p>One-click publishing to Public URLs, Email, and CRM platforms like Confluence.</p>
                    </div>
                    <div className="mockup-ui automate-ui">
                        <div className="toggle-row">
                            <span>Trigger QA</span>
                            <div className="toggle active"></div>
                        </div>
                        <div className="action-button">Publish to Confluence</div>
                    </div>
                </div>

            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2026 Relayer AI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;