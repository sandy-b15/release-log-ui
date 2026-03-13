import { useCallback, useRef } from 'react';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

/**
 * Hook to dynamically load Razorpay and open checkout.
 */
export function useRazorpay() {
  const scriptLoaded = useRef(false);

  const loadScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (scriptLoaded.current || window.Razorpay) {
        scriptLoaded.current = true;
        return resolve();
      }
      const script = document.createElement('script');
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      script.onload = () => {
        scriptLoaded.current = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  }, []);

  /**
   * Open Razorpay checkout modal (order-based).
   * @param {object} options
   * @param {string} options.orderId - Razorpay order ID
   * @param {number} options.amount - Amount in paise/cents
   * @param {string} options.currency - INR or USD
   * @param {string} options.rzKeyId - Razorpay key ID
   * @param {string} options.planName - Plan display name
   * @param {string} options.userEmail - User email
   * @param {string} options.userName - User name
   * @returns {Promise<{ razorpay_order_id, razorpay_payment_id, razorpay_signature }>}
   */
  const openCheckout = useCallback(async ({ orderId, amount, currency, rzKeyId, planName, userEmail, userName }) => {
    await loadScript();

    return new Promise((resolve, reject) => {
      const options = {
        key: rzKeyId,
        order_id: orderId,
        amount,
        currency,
        name: 'Releaslyy',
        description: `${planName} Plan`,
        prefill: {
          email: userEmail || '',
          name: userName || '',
        },
        theme: {
          color: '#1c1917',
        },
        handler: (response) => {
          resolve({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled'));
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  }, [loadScript]);

  return { openCheckout };
}
