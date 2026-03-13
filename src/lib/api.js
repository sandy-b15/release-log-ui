import axios from 'axios';

const API = `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({ baseURL: API, withCredentials: true });

// Rewrite upgrade_required errors so existing catch blocks
// (which read err.response.data.error) show a user-friendly message
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data;
    if (data?.error === 'upgrade_required') {
      data.error = 'Upgrade your subscription to use this feature.';
    }
    if (data?.error === 'subscription_expired') {
      data.error = 'Your subscription has expired. Please renew to continue.';
    }
    return Promise.reject(err);
  },
);

// For non-/api routes (auth, etc.)
const authApi = axios.create({ baseURL: import.meta.env.VITE_API_URL, withCredentials: true });

export default api;
export { API, authApi };
