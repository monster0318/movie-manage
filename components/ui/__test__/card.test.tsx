import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageCard from '../ImageCard'; // adjust the path as needed
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

// Mock next.js's useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(() => ({ locale: 'en' })),
}));

// Mock the useStore hook
jest.mock('@/store/useStore', () => ({
  useStore: jest.fn(),
}));

describe('ImageCard Component', () => {
  const mockDeleteMovie = jest.fn();
  const mockPush = jest.fn();
  
  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    useStore.mockReturnValue({ isMobile: false }); // Adjust this value as needed
  });

  const movieProps = {
    id: '1',
    image: 'http://example.com/image.jpg',
    title: 'Movie Title',
    year: 2023,
    deleteMovie: mockDeleteMovie,
  };

  test('renders the movie card correctly', () => {
    render(<ImageCard {...movieProps} />);
    
    // Check if image, title, and year are rendered
    const image = screen.getByRole('img');
    const title = screen.getByText('Movie Title');
    const year = screen.getByText('2023');
    
    expect(image).toHaveAttribute('src', movieProps.image);
    expect(title).toBeInTheDocument();
    expect(year).toBeInTheDocument();
  });

  test('navigates to the correct edit page when Edit button is clicked', () => {
    render(<ImageCard {...movieProps} />);
    
    const editButton = screen.getByLabelText(/edit/i); // May need to adjust the role and name
    fireEvent.click(editButton);
    
    // Check that router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/en/movies/edit/1/');
  });

  test('calls deleteMovie with the correct ID when Delete button is clicked', () => {
    render(<ImageCard {...movieProps} />);
    
    const deleteButton = screen.getByLabelText(/delete/i);
    fireEvent.click(deleteButton);
    
    // Check that deleteMovie was called with the correct ID
    expect(mockDeleteMovie).toHaveBeenCalledWith('1');
  });
});
