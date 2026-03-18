import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock CSS
vi.mock('../../src/pages/Integration/Integration.css', () => ({}));
vi.mock('../../src/components/Header/Header', () => ({
  default: ({ sub, title }) => <div data-testid="topbar" data-sub={sub} data-title={title} />,
}));
vi.mock('../../src/components/ConfirmDialog/ConfirmDialog', () => ({
  default: ({ open, title, onConfirm, onCancel }) =>
    open ? (
      <div data-testid="confirm-dialog">
        <span>{title}</span>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));
vi.mock('../../src/components/ui/Pill', () => ({
  default: ({ children }) => <span data-testid="pill">{children}</span>,
}));

// Mock image imports
vi.mock('../../src/assets/devrev-logo.webp', () => ({ default: 'devrev.png' }));
vi.mock('../../src/assets/gitlab-logo.png', () => ({ default: 'gitlab.png' }));
vi.mock('../../src/assets/bitbucket_icon.webp', () => ({ default: 'bitbucket.png' }));
vi.mock('../../src/assets/jira_logo.webp', () => ({ default: 'jira.png' }));
vi.mock('../../src/assets/slack-logo.png', () => ({ default: 'slack.png' }));

// Mock api
vi.mock('../../src/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

import Integration from '../../src/pages/Integration/Integration';
import api from '../../src/lib/api';

function renderIntegration() {
  return render(
    <MemoryRouter>
      <Integration />
    </MemoryRouter>
  );
}

describe('Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockImplementation((url) => {
      if (url === '/tokens/github') return Promise.resolve({ data: { hasToken: true } });
      if (url === '/tokens/devrev') return Promise.resolve({ data: { hasToken: false } });
      if (url === '/tokens/jira') return Promise.resolve({ data: { hasToken: false } });
      if (url === '/tokens/slack') return Promise.resolve({ data: { hasToken: false } });
      return Promise.resolve({ data: {} });
    });
  });

  it('should show loading state initially', () => {
    renderIntegration();
    expect(screen.getByText('Checking connections...')).toBeInTheDocument();
  });

  it('should render integration cards after loading', async () => {
    renderIntegration();
    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText('Jira')).toBeInTheDocument();
      expect(screen.getByText('DevRev')).toBeInTheDocument();
      expect(screen.getByText('Slack')).toBeInTheDocument();
      expect(screen.getByText('GitLab')).toBeInTheDocument();
    });
  });

  it('should show "Connected" pill for connected services', async () => {
    renderIntegration();
    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
    });
  });

  it('should show "Coming Soon" for GitLab (no apiConnect)', async () => {
    renderIntegration();
    await waitFor(() => {
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });
  });

  it('should show connect buttons for unconnected services', async () => {
    renderIntegration();
    await waitFor(() => {
      expect(screen.getByText('Connect with Jira')).toBeInTheDocument();
    });
  });

  it('should fetch token status on mount', async () => {
    renderIntegration();
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/tokens/github');
      expect(api.get).toHaveBeenCalledWith('/tokens/devrev');
      expect(api.get).toHaveBeenCalledWith('/tokens/jira');
      expect(api.get).toHaveBeenCalledWith('/tokens/slack');
    });
  });

  it('should render TopBar with correct props', () => {
    renderIntegration();
    const topbar = screen.getByTestId('topbar');
    expect(topbar).toHaveAttribute('data-sub', 'Integrations');
    expect(topbar).toHaveAttribute('data-title', 'Connect Your Tools');
  });

  it('should show stats section with connected and available counts', async () => {
    renderIntegration();
    await waitFor(() => {
      expect(screen.getByText('Connected')).toBeInTheDocument();
      expect(screen.getByText('Available')).toBeInTheDocument();
    });
  });

  it('should render category filter tabs', async () => {
    renderIntegration();
    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Development')).toBeInTheDocument();
      expect(screen.getByText('Project Mgmt')).toBeInTheDocument();
      expect(screen.getByText('Communication')).toBeInTheDocument();
    });
  });

  it('should filter cards when a tab is clicked', async () => {
    renderIntegration();
    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Communication'));
    // Only Slack should remain visible
    expect(screen.getByText('Slack')).toBeInTheDocument();
    expect(screen.queryByText('GitHub')).not.toBeInTheDocument();
    expect(screen.queryByText('Jira')).not.toBeInTheDocument();
  });

  it('should show confirm dialog when delete button is clicked', async () => {
    renderIntegration();
    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });
    // Find the delete button (Trash icon button)
    const deleteBtn = document.querySelector('.int-card-delete-btn');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    expect(screen.getByText('Disconnect Service')).toBeInTheDocument();
  });

  it('should handle disconnect when confirm dialog is confirmed', async () => {
    api.delete.mockResolvedValue({ data: {} });
    renderIntegration();
    await waitFor(() => {
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });
    const deleteBtn = document.querySelector('.int-card-delete-btn');
    fireEvent.click(deleteBtn);
    fireEvent.click(screen.getByText('Confirm'));
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/tokens/github');
    });
  });

  it('should show "Reconnect" button for connected OAuth services', async () => {
    renderIntegration();
    await waitFor(() => {
      expect(screen.getByText('Reconnect')).toBeInTheDocument();
    });
  });

  it('should show "Use token instead" fallback for GitHub', async () => {
    // GitHub has patConnect so when disconnected it shows the fallback
    api.get.mockImplementation((url) => {
      if (url === '/tokens/github') return Promise.resolve({ data: { hasToken: false } });
      if (url === '/tokens/devrev') return Promise.resolve({ data: { hasToken: false } });
      if (url === '/tokens/jira') return Promise.resolve({ data: { hasToken: false } });
      if (url === '/tokens/slack') return Promise.resolve({ data: { hasToken: false } });
      return Promise.resolve({ data: {} });
    });
    renderIntegration();
    await waitFor(() => {
      expect(screen.getByText('Use token instead')).toBeInTheDocument();
    });
  });

  it('should handle API error on token check gracefully', async () => {
    api.get.mockRejectedValue(new Error('Network error'));
    renderIntegration();
    await waitFor(() => {
      // Should not crash, should finish loading
      expect(screen.queryByText('Checking connections...')).not.toBeInTheDocument();
    });
  });
});
