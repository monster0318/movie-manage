import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditMovie from '../page'; // Adjust the import path as necessary
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';
import { NextIntlClientProvider } from 'next-intl';
import { useMovieStore } from '@/store/movieStore';
import { useParams } from 'next/navigation';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
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
    year_require: 'Publishing year required'
  },
};

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
    (useParams as jest.Mock).mockReturnValue({ locale: 'en' });
    (useMovieStore as jest.Mock).mockReturnValue({
      addMovie: jest.fn(),
    });
  });

  test('renders correctly with initial values', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <EditMovie />
      </NextIntlClientProvider>
    );

    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Publishing Year')).toBeInTheDocument();
    expect(screen.getByText('Create a new movie')).toBeInTheDocument();
  });



  test('shows error message for invalid input', async () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <EditMovie />
      </NextIntlClientProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Publishing Year'), { target: { value: '' } });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled(); // Adjust this based on your validation logic
    });
  });


  test('cancels and redirects', () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <EditMovie />
      </NextIntlClientProvider>
    );
  
    fireEvent.click(screen.getByTestId('cancel-button')); // Use data-testid
    expect(pushMock).toHaveBeenCalledWith('/en/movies');
  });
});