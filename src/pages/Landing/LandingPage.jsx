import Nav from '../../components/landing/Nav';
import Hero from '../../components/landing/Hero';
import SocialProof from '../../components/landing/SocialProof';
import Features from '../../components/landing/Features';
import Integrations from '../../components/landing/Integrations';
import ProductDemo from '../../components/landing/ProductDemo';
import HowItWorks from '../../components/landing/HowItWorks';
import CTASection from '../../components/landing/CTASection';
import Footer from '../../components/landing/Footer';
import SEO from '../../components/SEO';
import './LandingPage.css';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Releaslyy",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "description": "AI-powered release notes generator. Connect GitHub, Jira, or DevRev and generate polished release notes in seconds.",
  "url": "https://releaslyy.com",
  "image": "https://releaslyy.com/favicon-192x192.png",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "INR",
    "lowPrice": "0",
    "offerCount": "4"
  },
  "featureList": [
    "GitHub integration",
    "Jira integration",
    "DevRev integration",
    "Multiple LLM providers",
    "Export to Markdown, PDF, DOCX",
    "Publish to GitHub Releases"
  ]
};

export default function LandingPage() {
  return (
    <div className="landing-root">
      <SEO
        title="AI-Powered Release Notes Generator — Free"
        description="Generate release notes automatically from GitHub commits, Jira tickets, and DevRev sprints. Free AI changelog generator for dev teams. Connect your tools, pick changes, done."
        keywords="generate release notes automatically, automated release notes tool, ai changelog generator free, github release notes generator for free, jira release notes generator for free, devrev release notes generator for free, zoho release notes generator for free, product update generator, app update generator, how to generate release notes from commits, ai tool to create changelog from git commits, generate release notes from jira tickets, release notes generator, AI release notes, automatic changelog, changelog automation, software release notes tool, sprint release notes, release management tool, release notes template"
        canonical="https://releaslyy.com/"
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </SEO>
      <div className="land-noise" />
      <Nav />
      <Hero />
      <Features />
      <Integrations />
      <ProductDemo />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
}
