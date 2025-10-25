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
    const textarea = screen.getByPlaceholderText(/Enter your seed content ideas/i);
    const generateButton = screen.getByText('Proceed to RAG Process');

    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    fireEvent.click(generateButton);

    const ragProcessTab = await screen.findByText('2. RAG Process');
    expect(ragProcessTab).toBeInTheDocument();
  });

  it('switches between tabs', () => {
    render(<App />);
    const ragProcessTab = screen.getByText('2. RAG Process');
    fireEvent.click(ragProcessTab);

    const ragHeader = screen.getByText('⚡ RAG Processing');
    expect(ragHeader).toBeInTheDocument();
  });

  it('displays all 5 tabs in correct order', () => {
    render(<App />);
    
    expect(screen.getByText('🌱 1. Seed Data Collect and Normalize')).toBeInTheDocument();
    expect(screen.getByText('⚡ 2. RAG Process')).toBeInTheDocument();
    expect(screen.getByText('📝 3. Prompt Generation')).toBeInTheDocument();
    expect(screen.getByText('👁️ 4. Review and Execute')).toBeInTheDocument();
    expect(screen.getByText('🚀 5. LinkedIn Publishing')).toBeInTheDocument();
  });
});
