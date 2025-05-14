import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../page';
import { toast } from 'react-toastify';
import { NextIntlClientProvider } from 'next-intl';
import { act } from 'react';

// Mock the toast function
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

// Mock the fetch API
global.fetch = jest.fn();

// Mock next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: { locale: 'en' },
  }),
  useParams: jest.fn().mockReturnValue({ locale: 'en' }),
}));

const messages = {
  authPage: {
    sign_in: 'Sign in',
    email: 'Email',
    password: 'Password',
    incorrect: 'Incorrect credentials',
    server_error: 'Server error occurred',
    login: 'Login',
    have_account: 'Do you have an account?',
    sign_up: 'Sign Up',
    password_length: 'password length too short',
    password_require: 'password required',
    password_length_max: 'password length too long',
    invalid_email: "invalid email",
    email_require: "Email required",
    confirm_require: "Confirm password",
    password_not_match: "passwords are not match",
    confirm:"confirm password",
    register:"register",
    signup_success:"Successfully signed up!"
  },
};

describe('Register Component', () => {
  const renderWithIntl = (ui, { locale = 'en' } = {}) => {
    return render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        {ui}
      </NextIntlClientProvider>
    );
  };

  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllMocks();
  });

  test('renders the registration form', () => {
    renderWithIntl(<Register />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/password/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('submits the form and shows success message', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    renderWithIntl(<Register />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getAllByLabelText(/password/i)[0], { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/confirm/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Successfully signed up!'));
    });
  });
});
