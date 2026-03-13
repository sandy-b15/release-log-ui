import { useState } from "react";
import Nav from "../../components/landing/Nav";
import Footer from "../../components/landing/Footer";
import FadeIn from "../../components/landing/FadeIn";
import "../Landing/LandingPage.css";
import "../Docs/DocsPage.css";
import "./SupportPage.css";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just show confirmation — wire to backend/email later
    setSubmitted(true);
  };

  return (
    <div className="landing-root">
      <div className="land-noise" />
      <Nav />

      <section className="land-sec" style={{ paddingTop: 40 }}>
        <div className="land-con" style={{ maxWidth: 820 }}>
          <FadeIn>
            <div className="docs-content">
              <h1 className="docs-content-title">Support</h1>
              <div className="docs-content-body">
                <p>
                  Need help with Releaslyy? We're here to assist. Browse the resources below or send us a message.
                </p>

                <h3>Quick Resources</h3>
                <ul>
                  <li><a href="/docs">Documentation</a> — Guides for getting started, connecting integrations, and generating release notes.</li>
                  <li><a href="/docs#faq">FAQ</a> — Answers to commonly asked questions.</li>
                  <li><a href="/privacy">Privacy Policy</a> — How we handle your data.</li>
                  <li><a href="/terms">Terms & Conditions</a> — Our terms of service.</li>
                </ul>

                <h3>Common Issues</h3>

                <p><strong>Integration not connecting?</strong></p>
                <ul>
                  <li>Ensure your API token has the required scopes (e.g., <code>repo</code> for GitHub).</li>
                  <li>For Jira, make sure you complete the OAuth flow and authorize the correct Jira site.</li>
                  <li>Try disconnecting and reconnecting the integration from the Integrations page.</li>
                </ul>

                <p><strong>Release notes not generating?</strong></p>
                <ul>
                  <li>Check that you've selected at least one commit, sprint, or issue before continuing.</li>
                  <li>The AI generation service may be temporarily unavailable — try again in a few minutes.</li>
                </ul>

                <p><strong>Can't log in?</strong></p>
                <ul>
                  <li>Releaslyy uses Google OAuth. Make sure you're signing in with the same Google account you registered with.</li>
                  <li>Clear your browser cookies and try again if the session has expired.</li>
                </ul>

                <h3>Contact Us</h3>
                {submitted ? (
                  <div className="support-success">
                    <div className="support-success-icon">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
                    </div>
                    <p><strong>Message sent!</strong></p>
                    <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                    <button className="support-btn" onClick={() => setSubmitted(false)}>Send Another Message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="support-form">
                    <div className="support-field">
                      <label>Name</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
                    </div>
                    <div className="support-field">
                      <label>Email</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </div>
                    <div className="support-field">
                      <label>Subject</label>
                      <select value={subject} onChange={e => setSubject(e.target.value)}>
                        <option value="general">General Inquiry</option>
                        <option value="bug">Bug Report</option>
                        <option value="integration">Integration Issue</option>
                        <option value="account">Account & Billing</option>
                        <option value="feature">Feature Request</option>
                        <option value="deletion">Account Deletion</option>
                      </select>
                    </div>
                    <div className="support-field">
                      <label>Message</label>
                      <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue or question..." rows={5} required />
                    </div>
                    <button type="submit" className="support-btn">Send Message</button>
                  </form>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
