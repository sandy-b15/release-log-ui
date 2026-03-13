import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Login.css';
import logo from '../../assets/logos/releaslyy-logo-main.png';

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleLogin = () => {
        const redirectPath = searchParams.get('redirect') || '/dashboard';
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?redirect=${encodeURIComponent(redirectPath)}`;
    };

    return (
        <div className="login-wrapper">
            <button className="back-btn" onClick={() => navigate('/')}>
                <ArrowLeft size={20} /> Back to Home
            </button>

            <div className="login-left">
                <div className="brand-logo">
                    <img src={logo} alt="Releaslyy.com Logo" style={{ height: '30px' }} />
                </div>

                <h1 className="login-title">Welcome!</h1>
                <p className="login-subtitle">
                    Sign in to continue managing your release notes.
                </p>

                <div className="login-card-interactive">
                    <button onClick={handleLogin} className="google-login-btn">
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                        />
                        <span>Continue with Google</span>
                    </button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <p className="terms-text">
                        By clicking continue, you verify that you are an authorized user and agree to our <a href="/terms">Terms of Service</a>.
                    </p>
                </div>
            </div>

            <div className="login-right">
                <div className="feature-showcase">
                    <h2>Automate your workflow</h2>
                    <ul className="feature-list">
                        <li>
                            <CheckCircle2 className="check-icon" size={20} />
                            <span>Fetch commits from GitHub instantly</span>
                        </li>
                        <li>
                            <CheckCircle2 className="check-icon" size={20} />
                            <span>Generate AI summaries for stakeholders</span>
                        </li>
                        <li>
                            <CheckCircle2 className="check-icon" size={20} />
                            <span>Publish directly to Confluence</span>
                        </li>
                    </ul>

                    <div className="floating-card c1">
                        <span>feat: auth flow implementation</span>
                    </div>
                    <div className="floating-card c2">
                        <span>Release v1.2.0 is live! 🚀</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
