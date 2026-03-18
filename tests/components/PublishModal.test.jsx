import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock CSS
vi.mock('../../src/components/PublishModal/PublishModal.css', () => ({}));

// Mock image imports
vi.mock('../../src/assets/github.png', () => ({ default: 'github.png' }));
vi.mock('../../src/assets/jira_logo.webp', () => ({ default: 'jira.png' }));
vi.mock('../../src/assets/devrev-logo.webp', () => ({ default: 'devrev.png' }));
vi.mock('../../src/assets/slack-logo.png', () => ({ default: 'slack.png' }));

// Mock api
vi.mock('../../src/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

import PublishModal from '../../src/components/PublishModal/PublishModal';
import api from '../../src/lib/api';

function renderModal(props = {}) {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    noteId: 'note-123',
    noteTitle: 'Test Release v1.0',
    getHtmlContent: vi.fn(() => '<p>Release notes content</p>'),
    getJsonContent: vi.fn(() => ({ type: 'doc', content: [] })),
    isPublished: false,
  };
  return render(
    <MemoryRouter>
      <PublishModal {...defaultProps} {...props} />
    </MemoryRouter>
  );
}

describe('PublishModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock responses for the API calls on open
    api.get.mockImplementation((url) => {
      if (url === '/tokens') return Promise.resolve({ data: { services: ['github', 'jira'] } });
      if (url.startsWith('/publish/history/')) return Promise.resolve({ data: { publishedChannels: [] } });
      if (url.startsWith('/notes/')) return Promise.resolve({ data: { note: { is_public: false, public_slug: null } } });
      if (url === '/publish/github/repos') return Promise.resolve({ data: { repos: [{ full_name: 'owner/repo' }] } });
      if (url === '/publish/jira/projects') return Promise.resolve({ data: { projects: [{ key: 'PROJ', name: 'Project' }] } });
      return Promise.resolve({ data: {} });
    });
  });

  it('should render when open is true', async () => {
    renderModal();
    await waitFor(() => {
      expect(screen.getByText('Publish Release Notes')).toBeInTheDocument();
    });
  });

  it('should not render when open is false', () => {
    renderModal({ open: false });
    expect(screen.queryByText('Publish Release Notes')).not.toBeInTheDocument();
  });

  it('should show connected services as toggleable channel cards', async () => {
    renderModal();
    await waitFor(() => {
      expect(screen.getByText('GitHub Releases')).toBeInTheDocument();
      expect(screen.getByText('Jira Release')).toBeInTheDocument();
    });
  });

  it('should show "Not connected" for unconnected services', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/tokens') return Promise.resolve({ data: { services: [] } });
      if (url.startsWith('/publish/history/')) return Promise.resolve({ data: { publishedChannels: [] } });
      if (url.startsWith('/notes/')) return Promise.resolve({ data: { note: { is_public: false } } });
      return Promise.resolve({ data: {} });
    });
    renderModal();
    await waitFor(() => {
      const notConnectedElements = screen.getAllByText('Not connected');
      expect(notConnectedElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should have Cancel button that calls onClose', async () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should have close X button that calls onClose', async () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    await waitFor(() => {
      expect(screen.getByText('Publish Release Notes')).toBeInTheDocument();
    });
    const closeBtn = document.querySelector('.publish-close-btn');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('should disable publish button when no channels are enabled', async () => {
    renderModal();
    await waitFor(() => {
      const publishBtn = screen.getByText('Publish to 0 channels');
      expect(publishBtn).toBeDisabled();
    });
  });

  it('should show Public Changelog card', async () => {
    renderModal();
    await waitFor(() => {
      expect(screen.getByText('Public Changelog')).toBeInTheDocument();
    });
  });

  it('should fetch connected services on open', async () => {
    renderModal();
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/tokens');
    });
  });

  it('should fetch publish history on open when noteId is provided', async () => {
    renderModal();
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/publish/history/note-123');
    });
  });

  it('should show "already published" message when isPublished is true', async () => {
    renderModal({ isPublished: true });
    await waitFor(() => {
      expect(screen.getByText(/This note has been published before/)).toBeInTheDocument();
    });
  });
});
