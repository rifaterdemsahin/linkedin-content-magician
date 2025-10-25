import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders the header', () => {
    render(<App />);
    const header = screen.getByText('LinkedIn Content Magician 🧙‍♂️');
    expect(header).toBeInTheDocument();
  });

  it('generates content when the button is clicked', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Enter your content topic/i);
    const generateButton = screen.getByText('Generate Content');

    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    fireEvent.click(generateButton);

    const reviewTab = await screen.findByText('Review & Approve');
    expect(reviewTab).toBeInTheDocument();
  });

  it('switches between tabs', () => {
    render(<App />);
    const reviewTab = screen.getByText('Review');
    fireEvent.click(reviewTab);

    const reviewHeader = screen.getByText('👀 Review & Approve');
    expect(reviewHeader).toBeInTheDocument();
  });
});
