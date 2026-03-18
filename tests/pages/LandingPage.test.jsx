import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Mock CSS
vi.mock('../../src/pages/Landing/LandingPage.css', () => ({}));

// Mock landing sub-components
vi.mock('../../src/components/landing/Nav', () => ({
  default: () => <nav data-testid="nav">Nav</nav>,
}));
vi.mock('../../src/components/landing/Hero', () => ({
  default: () => <section data-testid="hero">Hero</section>,
}));
vi.mock('../../src/components/landing/SocialProof', () => ({
  default: () => <div data-testid="social-proof">SocialProof</div>,
}));
vi.mock('../../src/components/landing/Features', () => ({
  default: () => <section data-testid="features">Features</section>,
}));
vi.mock('../../src/components/landing/Integrations', () => ({
  default: () => <section data-testid="integrations">Integrations</section>,
}));
vi.mock('../../src/components/landing/ProductDemo', () => ({
  default: () => <section data-testid="product-demo">ProductDemo</section>,
}));
vi.mock('../../src/components/landing/HowItWorks', () => ({
  default: () => <section data-testid="how-it-works">HowItWorks</section>,
}));
vi.mock('../../src/components/landing/CTASection', () => ({
  default: () => <section data-testid="cta-section">CTASection</section>,
}));
vi.mock('../../src/components/landing/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));
vi.mock('../../src/components/SEO', () => ({
  default: ({ children, title, description }) => (
    <div data-testid="seo" data-title={title} data-description={description}>
      {children}
    </div>
  ),
}));

import LandingPage from '../../src/pages/Landing/LandingPage';

function renderLanding() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('LandingPage', () => {
  it('should render the Nav component', () => {
    renderLanding();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
  });

  it('should render the Hero section', () => {
    renderLanding();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
  });

  it('should render the Features section', () => {
    renderLanding();
    expect(screen.getByTestId('features')).toBeInTheDocument();
  });

  it('should render the Integrations section', () => {
    renderLanding();
    expect(screen.getByTestId('integrations')).toBeInTheDocument();
  });

  it('should render the ProductDemo section', () => {
    renderLanding();
    expect(screen.getByTestId('product-demo')).toBeInTheDocument();
  });

  it('should render the HowItWorks section', () => {
    renderLanding();
    expect(screen.getByTestId('how-it-works')).toBeInTheDocument();
  });

  it('should render the CTA section', () => {
    renderLanding();
    expect(screen.getByTestId('cta-section')).toBeInTheDocument();
  });

  it('should render the Footer', () => {
    renderLanding();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render SEO component with correct title', () => {
    renderLanding();
    const seo = screen.getByTestId('seo');
    expect(seo).toHaveAttribute('data-title', 'AI-Powered Release Notes Generator — Free');
  });

  it('should contain JSON-LD structured data script', () => {
    renderLanding();
    const seo = screen.getByTestId('seo');
    // The JSON-LD is rendered as a child of the SEO component
    const scriptEl = seo.querySelector('script[type="application/ld+json"]');
    expect(scriptEl).toBeInTheDocument();
    const jsonLd = JSON.parse(scriptEl.innerHTML);
    expect(jsonLd['@type']).toBe('SoftwareApplication');
    expect(jsonLd.name).toBe('Releaslyy');
  });

  it('should render the landing-root container', () => {
    const { container } = renderLanding();
    expect(container.querySelector('.landing-root')).toBeInTheDocument();
  });
});
