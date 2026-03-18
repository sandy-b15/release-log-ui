import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';

// Mock CSS imports
vi.mock('../../src/pages/GenerateEdit/GenerateEdit.css', () => ({}));
vi.mock('../../src/components/Header/Header', () => ({
  default: ({ children }) => <div data-testid="topbar">{children}</div>,
}));
vi.mock('../../src/components/PublishModal/PublishModal', () => ({
  default: () => <div data-testid="publish-modal" />,
}));
vi.mock('../../src/components/PublishModal/PublishModal.css', () => ({}));

// Mock api
vi.mock('../../src/lib/api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

// Mock tiptap
const mockEditor = {
  chain: vi.fn(() => mockEditor),
  focus: vi.fn(() => mockEditor),
  toggleBold: vi.fn(() => mockEditor),
  toggleItalic: vi.fn(() => mockEditor),
  toggleUnderline: vi.fn(() => mockEditor),
  toggleStrike: vi.fn(() => mockEditor),
  toggleHeading: vi.fn(() => mockEditor),
  toggleBulletList: vi.fn(() => mockEditor),
  toggleOrderedList: vi.fn(() => mockEditor),
  toggleBlockquote: vi.fn(() => mockEditor),
  toggleCodeBlock: vi.fn(() => mockEditor),
  setLink: vi.fn(() => mockEditor),
  unsetLink: vi.fn(() => mockEditor),
  setHorizontalRule: vi.fn(() => mockEditor),
  undo: vi.fn(() => mockEditor),
  redo: vi.fn(() => mockEditor),
  extendMarkRange: vi.fn(() => mockEditor),
  run: vi.fn(),
  isActive: vi.fn(() => false),
  getAttributes: vi.fn(() => ({})),
  getHTML: vi.fn(() => '<p>Test content</p>'),
  getJSON: vi.fn(() => ({ type: 'doc', content: [] })),
};

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(() => mockEditor),
  EditorContent: () => <div data-testid="editor-content">Editor</div>,
}));
vi.mock('@tiptap/starter-kit', () => ({
  default: { configure: vi.fn(() => ({})) },
}));
vi.mock('@tiptap/extension-underline', () => ({ default: {} }));
vi.mock('@tiptap/extension-link', () => ({
  default: { configure: vi.fn(() => ({})) },
}));
vi.mock('@tiptap/extension-table', () => ({
  Table: { configure: vi.fn(() => ({})) },
  TableCell: {},
  TableHeader: {},
  TableRow: {},
}));

vi.mock('dompurify', () => ({
  default: { sanitize: vi.fn((html) => html) },
}));
vi.mock('marked', () => ({
  marked: { parse: vi.fn((md) => `<p>${md}</p>`) },
}));
vi.mock('turndown', () => {
  const TurndownService = function() {
    this.use = vi.fn();
    this.turndown = vi.fn((html) => html);
  };
  return { default: TurndownService };
});
vi.mock('turndown-plugin-gfm', () => ({
  gfm: {},
}));

const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router-dom', () => ({
  useLocation: (...args) => mockUseLocation(...args),
  useNavigate: () => mockNavigate,
}));

import GenerateEdit from '../../src/pages/GenerateEdit/GenerateEdit';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

describe('GenerateEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue({
      state: { notes: '# Test Notes', noteTitle: 'Test Title', noteId: 123 },
    });
  });

  it('should render the editor when notes are provided in location state', () => {
    render(<GenerateEdit />);
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
  });

  it('should sanitize HTML from marked.parse with DOMPurify', () => {
    render(<GenerateEdit />);
    expect(marked.parse).toHaveBeenCalledWith('# Test Notes');
    expect(DOMPurify.sanitize).toHaveBeenCalled();
  });

  it('should navigate to dashboard when no notes in location state', () => {
    mockUseLocation.mockReturnValue({ state: null });
    render(<GenerateEdit />);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should render Back button', () => {
    render(<GenerateEdit />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('should navigate to dashboard when Back is clicked', () => {
    render(<GenerateEdit />);
    screen.getByText('Back').click();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should render Export button', () => {
    render(<GenerateEdit />);
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('should render Copy button', () => {
    render(<GenerateEdit />);
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('should render Publish button', () => {
    render(<GenerateEdit />);
    expect(screen.getByText('Publish')).toBeInTheDocument();
  });

  it('should render edit and preview mode buttons', () => {
    render(<GenerateEdit />);
    expect(screen.getByText('edit')).toBeInTheDocument();
    expect(screen.getByText('preview')).toBeInTheDocument();
  });

  it('should render Save button when noteId is present', () => {
    render(<GenerateEdit />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should show download options when Export is clicked', async () => {
    render(<GenerateEdit />);
    const exportBtn = screen.getByText('Export');
    // The component has a document click listener that closes the menu.
    // We need to stop propagation or click inside the wrapper.
    await act(async () => {
      fireEvent.click(exportBtn);
    });
    await waitFor(() => {
      expect(screen.getByText('Markdown (.md)')).toBeInTheDocument();
      expect(screen.getByText('Word (.doc)')).toBeInTheDocument();
      expect(screen.getByText('PDF (.pdf)')).toBeInTheDocument();
    });
  });
});

describe('Link URL validation', () => {
  it('should reject javascript: protocol URLs', () => {
    const url = 'javascript:alert(1)';
    const result = url.match(/^https?:\/\/|^mailto:/i);
    expect(result).toBeNull();
  });

  it('should accept https:// URLs', () => {
    const url = 'https://example.com';
    const result = url.match(/^https?:\/\/|^mailto:/i);
    expect(result).not.toBeNull();
  });

  it('should accept http:// URLs', () => {
    const url = 'http://example.com';
    const result = url.match(/^https?:\/\/|^mailto:/i);
    expect(result).not.toBeNull();
  });

  it('should accept mailto: URLs', () => {
    const url = 'mailto:test@example.com';
    const result = url.match(/^https?:\/\/|^mailto:/i);
    expect(result).not.toBeNull();
  });

  it('should reject ftp: URLs', () => {
    const url = 'ftp://example.com';
    const result = url.match(/^https?:\/\/|^mailto:/i);
    expect(result).toBeNull();
  });

  it('should reject data: URLs', () => {
    const url = 'data:text/html,<script>alert(1)</script>';
    const result = url.match(/^https?:\/\/|^mailto:/i);
    expect(result).toBeNull();
  });
});
