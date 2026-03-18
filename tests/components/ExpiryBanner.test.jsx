import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock useEntitlements
const mockUseEntitlements = vi.fn();
vi.mock('../../src/hooks/useEntitlements', () => ({
  useEntitlements: () => mockUseEntitlements(),
}));

import ExpiryBanner from '../../src/components/ExpiryBanner/ExpiryBanner';

function renderBanner() {
  return render(
    <MemoryRouter>
      <ExpiryBanner />
    </MemoryRouter>
  );
}

describe('ExpiryBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isExpiringSoon and isGracePeriod are both false', () => {
    mockUseEntitlements.mockReturnValue({
      isExpiringSoon: false,
      isGracePeriod: false,
      daysRemaining: null,
      subscription: {},
    });
    const { container } = renderBanner();
    expect(container.innerHTML).toBe('');
  });

  it('should show grace period message when isGracePeriod is true', () => {
    mockUseEntitlements.mockReturnValue({
      isExpiringSoon: false,
      isGracePeriod: true,
      daysRemaining: 3,
      subscription: {},
    });
    renderBanner();
    expect(screen.getByText(/Payment failed/)).toBeInTheDocument();
    expect(screen.getByText(/3 days/)).toBeInTheDocument();
  });

  it('should show trial ending message when subscription is trialing', () => {
    mockUseEntitlements.mockReturnValue({
      isExpiringSoon: true,
      isGracePeriod: false,
      daysRemaining: 5,
      subscription: { status: 'trialing' },
    });
    renderBanner();
    expect(screen.getByText(/trial ends in 5 days/)).toBeInTheDocument();
  });

  it('should show cancellation message when subscription is cancelled', () => {
    mockUseEntitlements.mockReturnValue({
      isExpiringSoon: true,
      isGracePeriod: false,
      daysRemaining: 7,
      subscription: { cancelled_at: '2026-01-01' },
    });
    renderBanner();
    expect(screen.getByText(/Pro plan expires in 7 days/)).toBeInTheDocument();
  });

  it('should show generic message when expiring but no specific status', () => {
    mockUseEntitlements.mockReturnValue({
      isExpiringSoon: true,
      isGracePeriod: false,
      daysRemaining: null,
      subscription: {},
    });
    renderBanner();
    expect(screen.getByText('Your subscription needs attention.')).toBeInTheDocument();
  });

  it('should render "Manage billing" button', () => {
    mockUseEntitlements.mockReturnValue({
      isExpiringSoon: true,
      isGracePeriod: false,
      daysRemaining: 3,
      subscription: { status: 'trialing' },
    });
    renderBanner();
    expect(screen.getByText('Manage billing')).toBeInTheDocument();
  });

  it('should handle singular day correctly', () => {
    mockUseEntitlements.mockReturnValue({
      isExpiringSoon: false,
      isGracePeriod: true,
      daysRemaining: 1,
      subscription: {},
    });
    renderBanner();
    expect(screen.getByText(/1 day/)).toBeInTheDocument();
    // Should not say "1 days"
    expect(screen.queryByText(/1 days/)).not.toBeInTheDocument();
  });

  it('should show grace period message without days when daysRemaining is null', () => {
    mockUseEntitlements.mockReturnValue({
      isExpiringSoon: false,
      isGracePeriod: true,
      daysRemaining: null,
      subscription: {},
    });
    renderBanner();
    expect(screen.getByText(/Payment failed.*Update your payment method to avoid losing Pro features./)).toBeInTheDocument();
  });
});
