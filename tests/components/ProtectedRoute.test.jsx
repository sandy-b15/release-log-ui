import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock the api module
vi.mock('../../src/lib/api', () => ({
  authApi: {
    get: vi.fn(),
  },
  default: { get: vi.fn(), post: vi.fn() },
}));

import { authApi } from '../../src/lib/api';
import ProtectedRoute from '../../src/components/ProtectedRoute';

function renderWithRouter(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    authApi.get.mockReturnValue(new Promise(() => {})); // never resolves
    renderWithRouter(
      <ProtectedRoute><div>Protected Content</div></ProtectedRoute>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render children when authenticated', async () => {
    authApi.get.mockResolvedValue({ data: { id: 1, name: 'Test User' } });
    renderWithRouter(
      <ProtectedRoute><div>Protected Content</div></ProtectedRoute>
    );
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('should redirect to login when not authenticated', async () => {
    authApi.get.mockRejectedValue(new Error('Unauthorized'));
    renderWithRouter(
      <ProtectedRoute><div>Protected Content</div></ProtectedRoute>,
      { route: '/dashboard' }
    );
    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});
