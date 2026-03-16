import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../lib/api';
import SEO from '../../components/SEO';
import '../Login/Login.css';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name is required');
    if (!email.trim()) return toast.error('Email is required');
    if (password.length < 8) return toast.error('Password must be at least 8 characters');

    setLoading(true);
    try {
      await authApi.post('/auth/signup', { name: name.trim(), email: email.trim(), password });
      toast.success('Verification code sent to your email');
      navigate(`/verify-otp?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?redirect=/dashboard`;
  };

  return (
    <div className="login-wrapper">
      <SEO
        title="Sign Up — Free AI Release Notes Generator"
        description="Create a free account and generate release notes automatically from GitHub commits, Jira tickets, and DevRev sprints. No credit card required."
        keywords="ai changelog generator free, free release notes generator, generate release notes automatically, github release notes generator for free, jira release notes generator for free, product update generator, app update generator, automated release notes tool"
        canonical="https://releaslyy.com/signup"
      />
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={20} /> Back to Home
      </button>

      <div className="login-left">
        <h1 className="login-title">Create your account</h1>
        <p className="login-subtitle">Get started with AI-powered release notes.</p>

        <div className="login-card-interactive">
          <button onClick={handleGoogleSignup} className="google-login-btn">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
            />
            <span>Continue with Google</span>
          </button>

          <div className="divider"><span>or</span></div>

          <form onSubmit={handleSignup} className="signup-form">
            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="signup-submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="auth-links">
            <span>Already have an account? <Link to="/login">Log in</Link></span>
          </div>

          <p className="terms-text" style={{ marginTop: '16px' }}>
            By signing up, you agree to our <a href="/terms">Terms of Service</a>.
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
            <span>Release v1.2.0 is live!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
