import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock CSS
vi.mock('../../src/components/Sidebar/Sidebar.css', () => ({}));

// Mock logo
vi.mock('../../src/assets/logos/releaslyy-logo-main.png', () => ({ default: 'releaslyy-logo.png' }));

// Mock api
vi.mock('../../src/lib/api', () => ({
  default: {
    get: vi.fn(),
  },
  authApi: {
    get: vi.fn(),
  },
}));

import Sidebar from '../../src/components/Sidebar/Sidebar';
import { authApi } from '../../src/lib/api';

function renderSidebar(initialRoute = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Sidebar />
    </MemoryRouter>
  );
}

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authApi.get.mockResolvedValue({
      data: { id: 42, name: 'Test User' },
    });
  });

  it('should render the Releaslyy logo', () => {
    renderSidebar();
    const logo = document.querySelector('.sidebar-logo-img');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('alt', 'Releaslyy');
  });

  it('should render Dashboard nav link', () => {
    renderSidebar();
    const links = screen.getAllByText('Dashboard');
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it('should render Integrations nav link', () => {
    renderSidebar();
    const links = screen.getAllByText('Integrations');
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it('should render Settings nav link', () => {
    renderSidebar();
    const links = screen.getAllByText('Settings');
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it('should render Changelog nav link after user is loaded', async () => {
    renderSidebar();
    await waitFor(() => {
      expect(screen.getAllByText('Changelog').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should not show Changelog link if auth fails', async () => {
    authApi.get.mockRejectedValue(new Error('Unauthorized'));
    renderSidebar();
    // Wait for the effect to settle
    await waitFor(() => {
      expect(authApi.get).toHaveBeenCalledWith('/auth/me');
    });
    // Changelog should not appear since userId is null
    expect(screen.queryByText('Changelog')).not.toBeInTheDocument();
  });

  it('should render mobile bottom nav', () => {
    renderSidebar();
    const bottomNav = document.querySelector('.bottom-nav');
    expect(bottomNav).toBeInTheDocument();
  });

  it('should fetch user ID on mount', () => {
    renderSidebar();
    expect(authApi.get).toHaveBeenCalledWith('/auth/me');
  });

  it('should have links pointing to correct routes', () => {
    renderSidebar();
    const dashboardLink = screen.getAllByText('Dashboard')[0].closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    const integrationsLink = screen.getAllByText('Integrations')[0].closest('a');
    expect(integrationsLink).toHaveAttribute('href', '/integration');
    const settingsLink = screen.getAllByText('Settings')[0].closest('a');
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });
});
