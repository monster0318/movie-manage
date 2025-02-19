import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastContainer } from 'react-toastify';
import { NextIntlClientProvider } from 'next-intl';
import Login from '../page'; // Adjust path based on your file structure
import { signIn } from 'next-auth/react';

// Mocking next-auth and other dependencies
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
  useParams: jest.fn().mockReturnValue({ locale: 'en' }),
}));

jest.mock('@/components/ui/CustomizedCheckbox', () => ({
  __esModule: true,
  default: () => <input type="checkbox" aria-label='Remember Me' />,
}));

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});


afterEach(() => {
  jest.clearAllMocks();
});

const messages = {
  authPage: {
    sign_in: 'Sign in',
    email: 'Email',
    password: 'Password',
    incorrect: 'Incorrect credentials',
    server_error: 'Server error occurred',
    login: 'Login',
    not_have_account: 'Don\'t have an account?',
    sign_up: 'Sign Up',
    password_length: 'password length too short',
    password_require: 'password required',
    password_length_max: 'password length too long',
    invalid_email: "invalid email",
    email_require: "Email required"
  },
};

describe('Login Page', () => {
  beforeEach(() => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <ToastContainer />
        <Login />
      </NextIntlClientProvider>
    );
  });

  const fillCredentials = (email, password) => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: password } });
  };

  test('renders form elements correctly', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles input changes correctly', () => {
    fillCredentials('user@example.com', 'password123');

    expect(screen.getByLabelText(/email/i).value).toBe('user@example.com');
    expect(screen.getByLabelText(/password/i).value).toBe('password123');
  });

  test('submits the form with correct credentials', async () => {
    signIn.mockResolvedValue({ ok: true });
    fillCredentials('user@example.com', 'password123');

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'user@example.com',
        password: 'password123',
      });
    });
  });

  test('displays error message for incorrect credentials', async () => {
    signIn.mockResolvedValue({ ok: false });
    fillCredentials('wrong@example.com', 'wrongpassword');

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/incorrect credentials/i)).toBeInTheDocument();
    });
  });
});
