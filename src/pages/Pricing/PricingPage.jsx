import Nav from '../../components/landing/Nav';
import Pricing from '../../components/landing/Pricing';
import Footer from '../../components/landing/Footer';
import '../Landing/LandingPage.css';

export default function PricingPage() {
  return (
    <div className="landing-root">
      <div className="land-noise" />
      <Nav />
      <div style={{ paddingTop: 64 }}>
        <Pricing />
      </div>
      <Footer />
    </div>
  );
}
