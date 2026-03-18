import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock CSS
vi.mock('../../src/components/Header/Header.css', () => ({}));

// Mock api
vi.mock('../../src/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
  authApi: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock useEntitlements
vi.mock('../../src/hooks/useEntitlements', () => ({
  useEntitlements: () => ({
    plan: { slug: 'pro' },
    canUse: vi.fn(() => ({ allowed: true })),
    entitlements: {},
    usage: {},
    refetch: vi.fn(),
  }),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

import Header from '../../src/components/Header/Header';
import api, { authApi } from '../../src/lib/api';

function renderHeader(props = {}) {
  return render(
    <MemoryRouter>
      <Header title="Dashboard" sub="Overview" {...props} />
    </MemoryRouter>
  );
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authApi.get.mockResolvedValue({
      data: { id: 1, name: 'Sandy Test', email: 'sandy@test.com', avatar: null },
    });
    api.get.mockImplementation((url) => {
      if (url === '/projects') return Promise.resolve({ data: { projects: [{ id: 1, name: 'My Project' }] } });
      if (url === '/projects/active') return Promise.resolve({ data: { project: { id: 1, name: 'My Project' } } });
      return Promise.resolve({ data: {} });
    });
  });

  it('should render the topbar header element', () => {
    renderHeader();
    const header = document.querySelector('.topbar');
    expect(header).toBeInTheDocument();
  });

  it('should render user name after fetching', async () => {
    renderHeader();
    await waitFor(() => {
      expect(screen.getByText('Sandy')).toBeInTheDocument();
    });
  });

  it('should show user initial as avatar when no avatar URL', async () => {
    renderHeader();
    await waitFor(() => {
      expect(screen.getByText('S')).toBeInTheDocument();
    });
  });

  it('should show avatar image when user has an avatar URL', async () => {
    authApi.get.mockResolvedValue({
      data: { id: 1, name: 'Sandy', email: 'sandy@test.com', avatar: 'https://example.com/avatar.jpg' },
    });
    renderHeader();
    await waitFor(() => {
      const img = document.querySelector('.topbar-avatar-img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });
  });

  it('should show plan badge for non-free plans', async () => {
    renderHeader();
    await waitFor(() => {
      expect(screen.getByText('PRO')).toBeInTheDocument();
    });
  });

  it('should show dropdown when user area is clicked', async () => {
    renderHeader();
    await waitFor(() => {
      expect(screen.getByText('Sandy')).toBeInTheDocument();
    });
    const userArea = document.querySelector('.topbar-user');
    fireEvent.click(userArea);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should call logout API and navigate to /login when Logout is clicked', async () => {
    authApi.post.mockResolvedValue({ data: {} });
    renderHeader();
    await waitFor(() => {
      expect(screen.getByText('Sandy')).toBeInTheDocument();
    });
    const userArea = document.querySelector('.topbar-user');
    fireEvent.click(userArea);
    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => {
      expect(authApi.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  it('should render ProjectSwitcher with active project name', async () => {
    renderHeader();
    await waitFor(() => {
      expect(screen.getByText('My Project')).toBeInTheDocument();
    });
  });

  it('should show "No Project" when no active project', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/projects') return Promise.resolve({ data: { projects: [] } });
      if (url === '/projects/active') return Promise.resolve({ data: { project: null } });
      return Promise.resolve({ data: {} });
    });
    renderHeader();
    await waitFor(() => {
      expect(screen.getByText('No Project')).toBeInTheDocument();
    });
  });

  it('should render children passed to the header', () => {
    renderHeader({ children: <button>Custom Action</button> });
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('should render the bell notification icon', () => {
    renderHeader();
    const bell = document.querySelector('.topbar-bell');
    expect(bell).toBeInTheDocument();
  });

  it('should fetch user data on mount', () => {
    renderHeader();
    expect(authApi.get).toHaveBeenCalledWith('/auth/me');
  });
});
