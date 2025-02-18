import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';
import { NextIntlClientProvider } from 'next-intl';
import { useMovieStore } from '@/store/movieStore'; // Ensure this import is correct
import { useParams } from 'next/navigation'; // Ensure this is imported
import EditMovie from '../page';

const messages = {
    moviePage: {
      create_movie: 'Create a new movie',
      title: 'Title',
      publish_year: 'Publishing Year',
      upload_failed: 'Upload failed!',
      add_success: 'Movie added successfully!',
      cancel: 'Cancel',
      submit: 'Submit',
      drop_img: 'Drop an image here', // Add this key
      upload_img: 'Upload an image here', // Add this key
      invalid_file_type: 'Invalid File type',
      file_size_exceed: 'File size too big!',
      invalid_year: 'Invalid year',
      title_require: 'Title required!',
      year_require: 'Publishing year required',
      edit: 'Edit'
    },
  };

// Mock necessary modules
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useParams: jest.fn(), // Mock useParams
}));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

jest.mock('@/store/movieStore', () => ({
    useMovieStore: jest.fn(),
}));

jest.mock('@/store/useStore', () => ({
    useStore: jest.fn(() => ({
        isMobile: false,
    })),
}));

jest.mock('@/hooks/useWindowResize', () => jest.fn());

describe('EditMovie Component', () => {
    let pushMock;

    beforeEach(() => {
        pushMock = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            push: pushMock,
            back: pushMock,
        });
        (useSession as jest.Mock).mockReturnValue({
            data: { user: { id: '123' } },
        });
        (useParams as jest.Mock).mockReturnValue({ id: '1', locale: 'en' }); // Mock useParams return value
    });

    test('should render the component with correct initial values', () => {
        (useMovieStore as jest.Mock).mockReturnValue({
            movies: [
                { id: '1', title: 'Inception', year: 2010 },
            ],
            updateMovie: jest.fn(),
        });

        render(
            <NextIntlClientProvider messages={messages} locale="en">
                <EditMovie />
            </NextIntlClientProvider>
        );

        expect(screen.getByPlaceholderText('Title')).toHaveValue('Inception');
        expect(screen.getByPlaceholderText('Publishing Year')).toHaveValue('2010');
    });

    // Other tests...

    test('should render EditMovie with translations', () => {
        render(
            <NextIntlClientProvider messages={messages} locale="en">
                <EditMovie />
            </NextIntlClientProvider>
        );

        // Your test assertions
    });

    // Continue with your other test cases...
});