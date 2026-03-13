import Nav from "../../components/landing/Nav";
import Footer from "../../components/landing/Footer";
import FadeIn from "../../components/landing/FadeIn";
import "../Landing/LandingPage.css";
import "../Docs/DocsPage.css";

export default function TermsPage() {
  return (
    <div className="landing-root">
      <div className="land-noise" />
      <Nav />

      <section className="land-sec" style={{ paddingTop: 40 }}>
        <div className="land-con" style={{ maxWidth: 820 }}>
          <FadeIn>
            <div className="docs-content">
              <h1 className="docs-content-title">Terms & Conditions</h1>
              <div className="docs-content-body">
                <p><strong>Effective Date:</strong> March 11, 2026</p>
                <p>
                  Welcome to Releaslyy. By accessing or using our platform, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the service.
                </p>

                <h3>1. Service Description</h3>
                <p>
                  Releaslyy is an AI-powered release notes generator that connects to your development and project management tools (GitHub, Jira, DevRev, etc.) to automatically generate professional release notes from your commits, issues, and sprints.
                </p>

                <h3>2. Account Registration</h3>
                <ul>
                  <li>You must sign in using a valid Google account via OAuth 2.0.</li>
                  <li>You are responsible for maintaining the security of your account and any connected integration tokens.</li>
                  <li>You must not share your account or allow unauthorized access to the platform through your credentials.</li>
                  <li>You must be at least 13 years of age to use Releaslyy.</li>
                </ul>

                <h3>3. Acceptable Use</h3>
                <p>You agree not to:</p>
                <ul>
                  <li>Use the platform for any illegal or unauthorized purpose.</li>
                  <li>Attempt to gain unauthorized access to the platform, its servers, or any connected third-party services.</li>
                  <li>Reverse engineer, decompile, or disassemble any part of the platform.</li>
                  <li>Use automated tools (bots, scrapers) to access the platform beyond its intended API usage.</li>
                  <li>Transmit malicious code or interfere with the platform's operation.</li>
                </ul>

                <h3>4. Integration Tokens & Data</h3>
                <ul>
                  <li>When you connect a third-party service, you grant Releaslyy permission to access data from that service on your behalf using the credentials you provide.</li>
                  <li>All tokens are encrypted at rest using AES-256-GCM encryption.</li>
                  <li>You can revoke access at any time by disconnecting the integration from the Integrations page.</li>
                  <li>You are responsible for ensuring your tokens have appropriate scopes and permissions.</li>
                </ul>

                <h3>5. AI-Generated Content</h3>
                <ul>
                  <li>Release notes are generated using third-party AI models. While we strive for accuracy, AI-generated content may contain errors or inaccuracies.</li>
                  <li>You are responsible for reviewing and editing generated content before publishing or sharing it.</li>
                  <li>Generated release notes are stored in your account and belong to you. You may export, modify, and distribute them freely.</li>
                  <li>We do not claim ownership over your generated content.</li>
                </ul>

                <h3>6. Intellectual Property</h3>
                <ul>
                  <li>The Releaslyy platform, including its design, code, logos, and documentation, is the intellectual property of Releaslyy.</li>
                  <li>Your data, integration content, and generated release notes remain your property.</li>
                  <li>You grant us a limited license to process your data solely for the purpose of providing the service.</li>
                </ul>

                <h3>7. Service Availability</h3>
                <ul>
                  <li>We aim to provide reliable service but do not guarantee 100% uptime.</li>
                  <li>The platform may be temporarily unavailable for maintenance, updates, or due to factors beyond our control.</li>
                  <li>We reserve the right to modify, suspend, or discontinue any part of the service with reasonable notice.</li>
                </ul>

                <h3>8. Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by law, Releaslyy shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to:
                </p>
                <ul>
                  <li>Loss of data or inaccuracies in AI-generated content.</li>
                  <li>Unauthorized access to your account due to compromised credentials.</li>
                  <li>Service interruptions or downtime.</li>
                  <li>Actions taken based on AI-generated release notes.</li>
                </ul>

                <h3>9. Account Termination</h3>
                <ul>
                  <li>You may delete your account at any time by contacting support.</li>
                  <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
                  <li>Upon termination, your data (including release notes and tokens) will be deleted from our systems.</li>
                </ul>

                <h3>10. Changes to Terms</h3>
                <p>
                  We may update these Terms & Conditions from time to time. Changes will be posted on this page with an updated effective date. Continued use of the platform after changes constitutes acceptance of the revised terms.
                </p>

                <h3>11. Governing Law</h3>
                <p>
                  These terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through good-faith negotiation before pursuing formal legal proceedings.
                </p>

                <h3>12. Contact</h3>
                <p>
                  For questions about these Terms & Conditions, please visit our <a href="/support">Support</a> page.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
