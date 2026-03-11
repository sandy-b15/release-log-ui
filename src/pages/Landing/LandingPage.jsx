import Nav from '../../components/landing/Nav';
import Hero from '../../components/landing/Hero';
import SocialProof from '../../components/landing/SocialProof';
import Features from '../../components/landing/Features';
import Integrations from '../../components/landing/Integrations';
import ProductDemo from '../../components/landing/ProductDemo';
import HowItWorks from '../../components/landing/HowItWorks';
import CTASection from '../../components/landing/CTASection';
import Footer from '../../components/landing/Footer';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-root">
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
