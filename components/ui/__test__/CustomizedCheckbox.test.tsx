import { render, fireEvent, screen } from '@testing-library/react';
import CustomizedCheckbox from '../CustomizedCheckbox';
import '@testing-library/jest-dom';

// Mock translation hook to avoid needing actual translation files
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key, // just returns the key for simplicity
}));

describe('CustomizedCheckbox', () => {
  it('should render checkbox with "remember_me" text', () => {
    render(<CustomizedCheckbox onChange={() => {}} />);

    // Check if the label "remember_me" is rendered
    const label = screen.getByText(/remember_me/i);
    expect(label).toBeInTheDocument();

    // Check if the actual checkbox input is rendered
    const checkbox = screen.getAllByRole('checkbox')[0];
    expect(checkbox).toBeInTheDocument();
  });

  it('should call onChange when checkbox is clicked', () => {
    const mockOnChange = jest.fn();
    render(<CustomizedCheckbox onChange={mockOnChange} />);

    // Target the actual checkbox input
    const checkbox = screen.getByLabelText(/remember me/i); // Use label text to find the checkbox
    
    // Simulate checking the checkbox
    fireEvent.click(checkbox);
    
    // Check if onChange has been called once
    expect(mockOnChange).toHaveBeenCalledTimes(1);

    // Simulate unchecking the checkbox
    fireEvent.click(checkbox);

    // Check if onChange has been called twice (one for checking, one for unchecking)
    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });

  it('should have the correct accessibility attributes', () => {
    render(<CustomizedCheckbox onChange={() => {}} />);

    // Target the actual checkbox input
    const checkbox = screen.getByLabelText(/remember me/i); // Use label text to find the checkbox
    
    // Check if the checkbox has the correct aria-label
    expect(checkbox).toHaveAttribute('aria-label', 'Remember Me');
  });
});
