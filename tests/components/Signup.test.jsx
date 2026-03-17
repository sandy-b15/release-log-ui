import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

vi.mock('../../src/lib/api', () => ({
  authApi: { post: vi.fn(), get: vi.fn() },
  default: { get: vi.fn(), post: vi.fn() },
}));

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

import Signup from '../../src/pages/Signup/Signup';

function renderSignup() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('Signup Page', () => {
  it('should render signup form with all fields', () => {
    renderSignup();
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Min 8 characters')).toBeInTheDocument();
  });

  it('should have Google signup button', () => {
    renderSignup();
    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
  });

  it('should have create account button', () => {
    renderSignup();
    expect(screen.getByText('Create account')).toBeInTheDocument();
  });

  it('should have login link', () => {
    renderSignup();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  it('should allow typing in all fields', () => {
    renderSignup();
    const nameInput = screen.getByPlaceholderText('Your name');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('Min 8 characters');

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(nameInput.value).toBe('John');
    expect(emailInput.value).toBe('john@test.com');
    expect(passwordInput.value).toBe('password123');
  });
});
