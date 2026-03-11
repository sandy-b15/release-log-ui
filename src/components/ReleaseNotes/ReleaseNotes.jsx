import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Copy } from 'lucide-react';
import './ReleaseNotes.css';

const ReleaseNotes = ({ notes }) => {
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([notes], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = "release_notes.md";
    document.body.appendChild(element);
    element.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    alert('Copied to clipboard!');
  };

  return (
    <div className="card release-notes-card">
      <div className="release-notes-header">
        <h2>Generated Release Notes</h2>
        <div className="release-notes-actions">
          <button onClick={handleCopy} className="action-btn" title="Copy to Clipboard">
            <Copy size={16} />
            <span>Copy</span>
          </button>
          <button onClick={handleDownload} className="action-btn primary" title="Download Markdown">
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
      </div>
      <div className="markdown-preview">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ReleaseNotes;

