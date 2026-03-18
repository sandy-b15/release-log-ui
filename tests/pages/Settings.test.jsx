import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock CSS
vi.mock('../../src/pages/Settings/Settings.css', () => ({}));

// Mock Header
vi.mock('../../src/components/Header/Header', () => ({
  default: ({ sub, title }) => <div data-testid="topbar" data-sub={sub} data-title={title} />,
}));

// Mock tab content components
vi.mock('../../src/pages/Settings/BasicInfo', () => ({
  default: () => <div data-testid="basic-info">BasicInfo Content</div>,
}));
vi.mock('../../src/pages/Settings/SettingsProjects', () => ({
  default: () => <div data-testid="settings-projects">Projects Content</div>,
}));
vi.mock('../../src/pages/Settings/PlansBilling', () => ({
  default: () => <div data-testid="plans-billing">PlansBilling Content</div>,
}));
vi.mock('../../src/pages/Settings/UsageMetrics', () => ({
  default: () => <div data-testid="usage-metrics">UsageMetrics Content</div>,
}));
vi.mock('../../src/pages/Settings/LLMKeys', () => ({
  default: () => <div data-testid="llm-keys">LLMKeys Content</div>,
}));
vi.mock('../../src/pages/Settings/SettingsIntegrations', () => ({
  default: () => <div data-testid="settings-integrations">SettingsIntegrations Content</div>,
}));

import Settings from '../../src/pages/Settings/Settings';

function renderSettings() {
  return render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>
  );
}

describe('Settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the TopBar with correct props', () => {
    renderSettings();
    const topbar = screen.getByTestId('topbar');
    expect(topbar).toHaveAttribute('data-sub', 'Settings');
    expect(topbar).toHaveAttribute('data-title', 'Preferences');
  });

  it('should render "Settings" heading', () => {
    renderSettings();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render settings description', () => {
    renderSettings();
    expect(screen.getByText('Manage your account, billing, and preferences')).toBeInTheDocument();
  });

  it('should render all tab buttons', () => {
    renderSettings();
    expect(screen.getByText('Basic Info')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Plans & Billing')).toBeInTheDocument();
    expect(screen.getByText('Usage Metrics')).toBeInTheDocument();
    expect(screen.getByText('LLM Keys')).toBeInTheDocument();
  });

  it('should show BasicInfo tab content by default', () => {
    renderSettings();
    expect(screen.getByTestId('basic-info')).toBeInTheDocument();
  });

  it('should switch to Plans & Billing tab when clicked', () => {
    renderSettings();
    fireEvent.click(screen.getByText('Plans & Billing'));
    expect(screen.getByTestId('plans-billing')).toBeInTheDocument();
    expect(screen.queryByTestId('basic-info')).not.toBeInTheDocument();
  });

  it('should switch to Usage Metrics tab when clicked', () => {
    renderSettings();
    fireEvent.click(screen.getByText('Usage Metrics'));
    expect(screen.getByTestId('usage-metrics')).toBeInTheDocument();
  });

  it('should switch to LLM Keys tab when clicked', () => {
    renderSettings();
    fireEvent.click(screen.getByText('LLM Keys'));
    expect(screen.getByTestId('llm-keys')).toBeInTheDocument();
  });

  it('should switch to Projects tab when clicked', () => {
    renderSettings();
    fireEvent.click(screen.getByText('Projects'));
    expect(screen.getByTestId('settings-projects')).toBeInTheDocument();
  });

  it('should apply active class to the selected tab', () => {
    renderSettings();
    const basicBtn = screen.getByText('Basic Info').closest('button');
    expect(basicBtn.className).toContain('active');

    fireEvent.click(screen.getByText('LLM Keys'));
    const llmBtn = screen.getByText('LLM Keys').closest('button');
    expect(llmBtn.className).toContain('active');
    expect(basicBtn.className).not.toContain('active');
  });
});
