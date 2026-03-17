import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Mock api
vi.mock('../../src/lib/api', () => ({
  authApi: { post: vi.fn(), get: vi.fn() },
  default: { get: vi.fn(), post: vi.fn() },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

import Login from '../../src/pages/Login/Login';

function renderLogin() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('Login Page', () => {
  it('should render login form', () => {
    renderLogin();
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument();
  });

  it('should have Google login button', () => {
    renderLogin();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('should have sign in button', () => {
    renderLogin();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should have forgot password link', () => {
    renderLogin();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('should have create account link', () => {
    renderLogin();
    expect(screen.getByText('Create account')).toBeInTheDocument();
  });

  it('should allow typing in email and password fields', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('Your password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});
