import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authApi } from '../lib/api';

const ProtectedRoute = ({ children }) => {
    const [status, setStatus] = useState('loading'); // loading | authenticated | unauthenticated
    const location = useLocation();

    useEffect(() => {
        authApi.get('/auth/me')
            .then(res => {
                if (res.data && res.data.id) {
                    setStatus('authenticated');
                } else {
                    setStatus('unauthenticated');
                }
            })
            .catch(() => {
                setStatus('unauthenticated');
            });
    }, []);

    if (status === 'loading') {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                color: '#64748b',
                fontSize: '1rem'
            }}>
                Loading...
            </div>
        );
    }

    if (status === 'unauthenticated') {
        // Pass the intended destination as a query param so we can redirect after login
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    return children;
};

export default ProtectedRoute;
