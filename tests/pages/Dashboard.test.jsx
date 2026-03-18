import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock CSS
vi.mock('../../src/pages/Dashboard/Dashboard.css', () => ({}));
vi.mock('../../src/components/Header/Header', () => ({
  default: ({ children }) => <div data-testid="topbar">{children}</div>,
}));
vi.mock('../../src/components/DataSelector/DataSelector', () => ({
  default: () => <div data-testid="data-selector" />,
}));
vi.mock('../../src/components/ui/Pill', () => ({
  default: ({ children }) => <span>{children}</span>,
}));
vi.mock('../../src/components/ui/StepIndicator', () => ({
  default: () => <div data-testid="step-indicator" />,
}));
vi.mock('../../src/components/ui/SearchDropdown', () => ({
  default: () => <div data-testid="search-dropdown" />,
}));
vi.mock('../../src/components/ConfirmDialog/ConfirmDialog', () => ({
  default: () => <div data-testid="confirm-dialog" />,
}));
vi.mock('../../src/components/generate/LLMSelector', () => ({
  default: () => <div data-testid="llm-selector" />,
}));

// Mock image imports
vi.mock('../../src/assets/devrev-logo.webp', () => ({ default: 'devrev.png' }));
vi.mock('../../src/assets/jira_logo.webp', () => ({ default: 'jira.png' }));
vi.mock('../../src/assets/groq-logo.svg', () => ({ default: 'groq.svg' }));
vi.mock('../../src/assets/openai-logo.svg', () => ({ default: 'openai.svg' }));
vi.mock('../../src/assets/anthropic-logo.svg', () => ({ default: 'anthropic.svg' }));
vi.mock('../../src/assets/gemini-logo.svg', () => ({ default: 'gemini.svg' }));
vi.mock('../../src/assets/logos/releaslyy-logo-main.png', () => ({ default: 'releasly.png' }));

// Mock api
vi.mock('../../src/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
  authApi: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock hooks
vi.mock('../../src/hooks/useLLMKeys', () => ({
  useLLMKeys: () => ({
    savedKeys: [],
    catalogue: [],
  }),
}));
vi.mock('../../src/hooks/useEntitlements', () => ({
  useEntitlements: () => ({
    canUse: vi.fn(() => true),
    usage: { generations_this_month: 0 },
    entitlements: { max_generations_per_month: 10 },
    refetch: vi.fn(),
  }),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

import Dashboard from '../../src/pages/Dashboard/Dashboard';
import api, { authApi } from '../../src/lib/api';

function renderDashboard() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear sessionStorage before each test
    sessionStorage.clear();

    // Default mock responses
    authApi.get.mockResolvedValue({
      data: { id: 1, name: 'Test User', email: 'test@example.com' },
    });
    api.get.mockImplementation((url) => {
      if (url === '/tokens/github') return Promise.resolve({ data: { hasToken: true } });
      if (url === '/tokens/devrev') return Promise.resolve({ data: { hasToken: false } });
      if (url === '/tokens/jira') return Promise.resolve({ data: { hasToken: false } });
      if (url === '/tokens') return Promise.resolve({ data: { services: ['github'] } });
      if (url === '/notes') return Promise.resolve({ data: { notes: [] } });
      if (url === '/notes/count') return Promise.resolve({ data: { count: 0 } });
      if (url === '/publish/activity') return Promise.resolve({ data: { events: [], totalPublished: 0 } });
      if (url === '/audiences') return Promise.resolve({ data: [{ id: 'qa', label: 'QA' }] });
      return Promise.resolve({ data: {} });
    });
  });

  it('should show loading state initially', () => {
    renderDashboard();
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('should render overview section after loading', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument();
    });
  });

  it('should show "New Release Note" button', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('New Release Note')).toBeInTheDocument();
    });
  });

  it('should show stats section with Notes Generated', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Notes Generated')).toBeInTheDocument();
    });
  });

  it('should show stats section with Published', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Published')).toBeInTheDocument();
    });
  });

  it('should show stats section with Integrations', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Integrations')).toBeInTheDocument();
    });
  });

  it('should fetch initial data on mount', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(authApi.get).toHaveBeenCalledWith('/auth/me');
      expect(api.get).toHaveBeenCalledWith('/tokens');
    });
  });

  it('should handle corrupted sessionStorage gracefully', () => {
    sessionStorage.setItem('github_selectedCommits', '{invalid-json');
    sessionStorage.setItem('devrev_selectedBoard', '{invalid-json');
    sessionStorage.setItem('devrev_selectedSprints', '{invalid-json');

    // Should not throw - the try/catch in useState initializers handles this
    expect(() => renderDashboard()).not.toThrow();
  });

  it('should display greeting with user name', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  it('should show Recent Notes section', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Recent Notes')).toBeInTheDocument();
    });
  });
});
