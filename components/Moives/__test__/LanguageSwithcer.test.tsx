import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, usePathname, useParams } from 'next/navigation';
import '@testing-library/jest-dom';
import LanguageSwitcher from '../LanguageSwitcher';
// Mocking the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useParams: jest.fn(),
}));

describe('LanguageSwitcher Component', () => {
  const mockReplace = jest.fn();
  const mockUsePathname = usePathname as jest.Mock;
  const mockUseParams = useParams as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ replace: mockReplace });
    mockUsePathname.mockReturnValue('/en/about');
    mockUseParams.mockReturnValue({ locale: 'en' });
  });

  it('should render the component with correct language buttons', () => {
    render(<LanguageSwitcher />);

    // Check if both buttons are rendered
    expect(screen.getByText('🇬🇧 English')).toBeInTheDocument();
    expect(screen.getByText('🇫🇷 Français')).toBeInTheDocument();
  });

  it('should highlight the button for the current language', () => {
    render(<LanguageSwitcher />);

    // Check if the button for the current language has the 'selected' class
    expect(screen.getByText('🇬🇧 English')).toHaveClass('selected');
    expect(screen.getByText('🇫🇷 Français')).not.toHaveClass('selected');
  });

  it('should call router.replace with the correct path when switching languages', () => {
    render(<LanguageSwitcher />);

    // Simulate clicking on the French button
    fireEvent.click(screen.getByText('🇫🇷 Français'));

    // Expect router.replace to have been called with the correct path
    expect(mockReplace).toHaveBeenCalledWith('/fr/about');
  });

  it('should update the path when switching languages', () => {
    mockUsePathname.mockReturnValue('/fr/about'); // Change path to simulate French route
    mockUseParams.mockReturnValue({ locale: 'fr' });

    render(<LanguageSwitcher />);

    // Simulate clicking on the English button
    fireEvent.click(screen.getByText('🇬🇧 English'));

    // Expect router.replace to have been called with the correct path
    expect(mockReplace).toHaveBeenCalledWith('/en/about');
  });
});
