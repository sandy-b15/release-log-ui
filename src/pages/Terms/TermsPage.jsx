import Nav from "../../components/landing/Nav";
import Footer from "../../components/landing/Footer";
import FadeIn from "../../components/landing/FadeIn";
import SEO from "../../components/SEO";
import "../Landing/LandingPage.css";
import "../Docs/DocsPage.css";

export default function TermsPage() {
  return (
    <div className="landing-root">
      <SEO
        title="Terms of Service"
        description="Releaslyy terms of service. Read our terms and conditions for using the AI-powered release notes platform."
        keywords="Releaslyy terms, terms of service, terms and conditions"
        canonical="https://releaslyy.com/terms"
      />
      <div className="land-noise" />
      <Nav />

      <section className="land-sec" style={{ paddingTop: 40 }}>
        <div className="land-con" style={{ maxWidth: 820 }}>
          <FadeIn>
            <div className="docs-content">
              <h1 className="docs-content-title">Terms & Conditions</h1>
              <div className="docs-content-body">
                <p><strong>Effective Date:</strong> March 16, 2026</p>
                <p>
                  Welcome to Releaslyy. By accessing or using our platform, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the service.
                </p>

                <h3>1. Service Description</h3>
                <p>
                  Releaslyy is an AI-powered release notes generator that connects to your development and project management tools (GitHub, Jira, DevRev, etc.) to automatically generate professional release notes from your commits, issues, and sprints. The platform offers multiple audience types (QA, Product, Stakeholder, Engineering, Sales/Marketing, Developer Community) and supports publishing to connected platforms.
                </p>

                <h3>2. Account Registration</h3>
                <ul>
                  <li>You may sign in using Google OAuth or by creating an account with your email address and password.</li>
                  <li>If you register with email, you must verify your email address via a one-time verification code (OTP) before your account is fully activated.</li>
                  <li>You are responsible for maintaining the security of your account credentials and any connected integration tokens.</li>
                  <li>You must not share your account or allow unauthorized access to the platform through your credentials.</li>
                  <li>You must be at least 13 years of age to use Releaslyy.</li>
                  <li>If you sign in with both Google and email using the same email address, your accounts will be linked automatically.</li>
                </ul>

                <h3>3. Subscription Plans & Billing</h3>
                <ul>
                  <li>Releaslyy offers a Free plan and paid subscription plans (Pro, Team, Enterprise). Plan details, features, and pricing are listed on our <a href="/pricing">Pricing</a> page.</li>
                  <li>Paid subscriptions are billed monthly or annually, depending on your selection at the time of purchase.</li>
                  <li>Payments are processed securely through Razorpay. By subscribing to a paid plan, you agree to Razorpay's terms of service.</li>
                  <li>Subscription renewals are automatic. You will be charged at the start of each billing cycle unless you cancel before renewal.</li>
                  <li>Prices are displayed in USD or INR based on your location. The currency selected at checkout applies for the duration of your subscription.</li>
                </ul>

                <h3>4. Free Trial</h3>
                <ul>
                  <li>Some paid plans include a free trial period (currently 14 days for Pro).</li>
                  <li>During the trial, you have full access to the plan's features.</li>
                  <li>If you do not cancel before the trial ends, your subscription will automatically convert to a paid plan and you will be charged.</li>
                  <li>Each user is eligible for one free trial per plan.</li>
                </ul>

                <h3>5. Cancellation & Downgrade</h3>
                <ul>
                  <li>You may cancel your paid subscription at any time from the Settings page. After cancellation, you retain access to paid features until the end of your current billing period.</li>
                  <li>You may downgrade to the Free plan at any time. Downgrading takes effect immediately and you will lose access to paid features right away.</li>
                  <li><strong>No refunds are provided for downgrades, cancellations, or unused portions of a billing period.</strong></li>
                  <li>If you downgrade and wish to upgrade again later, you will need to purchase a new subscription at the then-current price.</li>
                </ul>

                <h3>6. Refund Policy</h3>
                <ul>
                  <li>All payments are non-refundable except in cases of duplicate charges or billing errors.</li>
                  <li>If you believe you were charged in error, contact us within 7 days of the charge via our <a href="/support">Support</a> page.</li>
                  <li>Refunds for billing errors will be processed within 5-10 business days through the original payment method.</li>
                </ul>

                <h3>7. Acceptable Use</h3>
                <p>You agree not to:</p>
                <ul>
                  <li>Use the platform for any illegal or unauthorized purpose.</li>
                  <li>Attempt to gain unauthorized access to the platform, its servers, or any connected third-party services.</li>
                  <li>Reverse engineer, decompile, or disassemble any part of the platform.</li>
                  <li>Use automated tools (bots, scrapers) to access the platform beyond its intended API usage.</li>
                  <li>Transmit malicious code or interfere with the platform's operation.</li>
                  <li>Abuse rate limits or attempt to circumvent usage restrictions on your plan.</li>
                </ul>

                <h3>8. Integration Tokens & Data</h3>
                <ul>
                  <li>When you connect a third-party service (GitHub, Jira, DevRev, etc.), you grant Releaslyy permission to access data from that service on your behalf using the credentials you provide.</li>
                  <li>All tokens are encrypted at rest using AES-256-GCM encryption.</li>
                  <li>You can revoke access at any time by disconnecting the integration from the Integrations page.</li>
                  <li>You are responsible for ensuring your tokens have appropriate scopes and permissions.</li>
                </ul>

                <h3>9. Bring Your Own Key (BYOK)</h3>
                <ul>
                  <li>Paid plans allow you to use your own API keys for supported LLM providers (OpenAI, Anthropic, Grok, Google Gemini).</li>
                  <li>Your API keys are encrypted at rest using AES-256-GCM encryption and are never shared with other users.</li>
                  <li>You are responsible for any costs incurred with third-party AI providers through your own API keys.</li>
                  <li>Releaslyy is not responsible for charges, rate limits, or service interruptions from third-party AI providers when using BYOK.</li>
                  <li>Token usage from BYOK requests is tracked in your account for transparency.</li>
                </ul>

                <h3>10. AI-Generated Content</h3>
                <ul>
                  <li>Release notes are generated using third-party AI models (Grok, OpenAI, Anthropic, Google Gemini). While we strive for accuracy, AI-generated content may contain errors or inaccuracies.</li>
                  <li>You are responsible for reviewing and editing generated content before publishing or sharing it.</li>
                  <li>Generated release notes are stored in your account and belong to you. You may export, modify, and distribute them freely.</li>
                  <li>We do not claim ownership over your generated content.</li>
                  <li>Token usage (prompt and completion tokens) is tracked per generation for transparency and is visible in your Settings.</li>
                </ul>

                <h3>11. Intellectual Property</h3>
                <ul>
                  <li>The Releaslyy platform, including its design, code, logos, prompt templates, and documentation, is the intellectual property of Releaslyy.</li>
                  <li>Your data, integration content, and generated release notes remain your property.</li>
                  <li>You grant us a limited license to process your data solely for the purpose of providing the service.</li>
                </ul>

                <h3>12. Service Availability</h3>
                <ul>
                  <li>We aim to provide reliable service but do not guarantee 100% uptime.</li>
                  <li>The platform may be temporarily unavailable for maintenance, updates, or due to factors beyond our control.</li>
                  <li>We reserve the right to modify, suspend, or discontinue any part of the service with reasonable notice.</li>
                  <li>Feature availability may vary by plan. We reserve the right to change plan features with advance notice.</li>
                </ul>

                <h3>13. Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by law, Releaslyy shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to:
                </p>
                <ul>
                  <li>Loss of data or inaccuracies in AI-generated content.</li>
                  <li>Unauthorized access to your account due to compromised credentials.</li>
                  <li>Service interruptions or downtime.</li>
                  <li>Actions taken based on AI-generated release notes.</li>
                  <li>Charges incurred through third-party AI providers when using BYOK.</li>
                  <li>Payment processing issues handled by Razorpay.</li>
                </ul>

                <h3>14. Account Termination</h3>
                <ul>
                  <li>You may delete your account at any time from the Settings page. Account deletion is permanent.</li>
                  <li>Upon account deletion, all your data — including release notes, integration tokens, LLM keys, projects, and billing history — will be permanently removed from our systems.</li>
                  <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
                  <li>If your account is terminated due to a terms violation, no refund will be provided for any remaining subscription period.</li>
                </ul>

                <h3>15. Privacy</h3>
                <p>
                  Your use of Releaslyy is also governed by our <a href="/privacy">Privacy Policy</a>, which describes how we collect, use, and protect your information.
                </p>

                <h3>16. Changes to Terms</h3>
                <p>
                  We may update these Terms & Conditions from time to time. Changes will be posted on this page with an updated effective date. Continued use of the platform after changes constitutes acceptance of the revised terms.
                </p>

                <h3>17. Governing Law</h3>
                <p>
                  These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, India. Before pursuing formal legal proceedings, both parties agree to attempt resolution through good-faith negotiation.
                </p>

                <h3>18. Contact</h3>
                <p>
                  For questions about these Terms & Conditions, please visit our <a href="/support">Support</a> page or email us at hello@releaslyy.com.
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
