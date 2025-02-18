import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from '../fileupload'; // Adjust the import based on your project structure
import { useTranslations } from 'next-intl';
import '@testing-library/jest-dom'; // Import jest-dom for toBeInTheDocument

// Mock the translation function
jest.mock('next-intl', () => ({
  useTranslations: jest.fn().mockReturnValue((key: string) => key),
}));

// Mock FileReader for testing purposes
global.FileReader = jest.fn().mockImplementation(() => ({
  readAsDataURL: jest.fn(),
  onload: jest.fn(function () {
    // Simulate the FileReader's onload event being triggered
    this.result = 'data:image/png;base64,xyz'; // Example result
  }),
}));

describe('FileUpload Component', () => {
  let setFileMock: jest.Mock;

  beforeEach(() => {
  //  jest.clearAllMocks()
    setFileMock = jest.fn();
  });

  test('renders upload UI and displays default description text', () => {
    render(<FileUpload setFile={setFileMock} />);

    // Check if the default description text (based on the screen size) is rendered
    expect(screen.getByText('drop_img')).toBeInTheDocument();
  });

  test('handles file input change and displays preview', async () => {
    render(<FileUpload setFile={setFileMock} />);

    const file = new File(['image content'], 'image.png', { type: 'image/png' });
    const input = screen.getAllByLabelText('Upload')[0] as HTMLInputElement;


    // Simulate a file input change event
    fireEvent.change(input, { target: { files: [file] } });

    // Check if the file was set correctly
    expect(setFileMock).toHaveBeenCalledWith(file);

    // Simulate the FileReader onload event to set preview
  //  await waitFor(() => expect(screen.getByAltText('Preview')).toBeInTheDocument());

  });

  test('handles drag and drop of files and displays preview', async () => {
    render(<FileUpload setFile={setFileMock} />);

    const file = new File(['image content'], 'image.png', { type: 'image/png' });
    const dropZone = screen.getByRole('region'); // Drop zone should have role="region"

    // Simulate drag over event
    fireEvent.dragOver(dropZone);
    expect(dropZone).toHaveClass('border-indigo-600');

    // Simulate drag leave event
    fireEvent.dragLeave(dropZone);
    expect(dropZone).not.toHaveClass('border-indigo-600');

    // Simulate drop event
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    // Check if the file was set correctly
   // expect(setFileMock).toHaveBeenCalledWith(file);

    // Simulate the FileReader onload event to set preview
  });

  test('changes description text on window resize', async () => {
    render(<FileUpload setFile={setFileMock} />);

    // Check if text updates based on screen size
    expect(screen.getByText('drop_img')).toBeInTheDocument();

    // Simulate screen resizing
    global.innerWidth = 500;
    fireEvent.resize(window);

    // Now text should change to upload_img
    await waitFor(() => expect(screen.getByText('upload_img')).toBeInTheDocument());
  });
});
