import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useRazorpay } from '../../src/hooks/useRazorpay';

describe('useRazorpay', () => {
  let mockRzpInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRzpInstance = { open: vi.fn() };
    // Clean up any existing Razorpay mock
    delete window.Razorpay;
  });

  it('should return openCheckout function', () => {
    const { result } = renderHook(() => useRazorpay());
    expect(typeof result.current.openCheckout).toBe('function');
  });

  it('should load Razorpay script and open checkout', async () => {
    // Use a regular function so it can be used with `new`
    window.Razorpay = vi.fn(function (options) {
      this.open = function () {
        options.handler({
          razorpay_order_id: 'order_123',
          razorpay_payment_id: 'pay_123',
          razorpay_signature: 'sig_123',
        });
      };
    });

    const { result } = renderHook(() => useRazorpay());

    let paymentResult;
    await act(async () => {
      paymentResult = await result.current.openCheckout({
        orderId: 'order_123',
        amount: 99900,
        currency: 'INR',
        rzKeyId: 'rzp_test_key',
        planName: 'Pro',
        userEmail: 'test@example.com',
        userName: 'Test User',
      });
    });

    expect(window.Razorpay).toHaveBeenCalled();
    expect(paymentResult).toEqual({
      razorpay_order_id: 'order_123',
      razorpay_payment_id: 'pay_123',
      razorpay_signature: 'sig_123',
    });
  });

  it('should reject when payment is cancelled via modal dismiss', async () => {
    window.Razorpay = vi.fn(function (options) {
      this.open = function () {
        options.modal.ondismiss();
      };
    });

    const { result } = renderHook(() => useRazorpay());

    await expect(
      act(async () => {
        await result.current.openCheckout({
          orderId: 'order_123',
          amount: 99900,
          currency: 'INR',
          rzKeyId: 'rzp_test_key',
          planName: 'Pro',
          userEmail: 'test@example.com',
          userName: 'Test',
        });
      })
    ).rejects.toThrow('Payment cancelled');
  });

  it('should pass correct options to Razorpay constructor', async () => {
    window.Razorpay = vi.fn(function (options) {
      this.open = function () {
        options.handler({
          razorpay_order_id: 'order_456',
          razorpay_payment_id: 'pay_456',
          razorpay_signature: 'sig_456',
        });
      };
    });

    const { result } = renderHook(() => useRazorpay());

    await act(async () => {
      await result.current.openCheckout({
        orderId: 'order_456',
        amount: 49900,
        currency: 'USD',
        rzKeyId: 'rzp_live_key',
        planName: 'Team',
        userEmail: 'user@example.com',
        userName: 'User',
      });
    });

    const calledOptions = window.Razorpay.mock.calls[0][0];
    expect(calledOptions.key).toBe('rzp_live_key');
    expect(calledOptions.order_id).toBe('order_456');
    expect(calledOptions.amount).toBe(49900);
    expect(calledOptions.currency).toBe('USD');
    expect(calledOptions.name).toBe('Releaslyy');
    expect(calledOptions.description).toBe('Team Plan');
    expect(calledOptions.prefill.email).toBe('user@example.com');
    expect(calledOptions.prefill.name).toBe('User');
  });
});
