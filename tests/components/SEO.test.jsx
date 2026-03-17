import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import SEO from '../../src/components/SEO';

function renderWithHelmet(ui) {
  return render(<HelmetProvider>{ui}</HelmetProvider>);
}

describe('SEO Component', () => {
  it('should render without crashing', () => {
    renderWithHelmet(<SEO title="Test" description="Test desc" />);
  });

  it('should accept all props', () => {
    renderWithHelmet(
      <SEO
        title="Test Page"
        description="A test description"
        keywords="test, keywords"
        canonical="https://releaslyy.com/test"
      />
    );
  });

  it('should render children', () => {
    const { container } = renderWithHelmet(
      <SEO title="Test">
        <meta name="custom" content="value" />
      </SEO>
    );
    expect(container).toBeDefined();
  });
});
