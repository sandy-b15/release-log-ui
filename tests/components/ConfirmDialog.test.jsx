import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock CSS
vi.mock('../../src/components/ConfirmDialog/ConfirmDialog.css', () => ({}));

import ConfirmDialog from '../../src/components/ConfirmDialog/ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    variant: 'danger',
    loading: false,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when open is true', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    render(<ConfirmDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Delete Item')).not.toBeInTheDocument();
  });

  it('should display the title', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
  });

  it('should display the message', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
  });

  it('should display custom confirm label', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should display custom cancel label', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('Delete'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when overlay is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const overlay = document.querySelector('.confirm-overlay');
    fireEvent.click(overlay);
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call onCancel when close X button is clicked', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const closeBtn = document.querySelector('.confirm-close-btn');
    fireEvent.click(closeBtn);
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should call onCancel when Escape key is pressed', () => {
    render(<ConfirmDialog {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should show "Processing..." when loading is true', () => {
    render(<ConfirmDialog {...defaultProps} loading={true} />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('should disable confirm button when loading is true', () => {
    render(<ConfirmDialog {...defaultProps} loading={true} />);
    const confirmBtn = screen.getByText('Processing...');
    expect(confirmBtn).toBeDisabled();
  });

  it('should apply the correct variant class', () => {
    render(<ConfirmDialog {...defaultProps} variant="warning" />);
    const dialog = document.querySelector('.confirm-dialog');
    expect(dialog.className).toContain('variant-warning');
  });

  it('should use default title when none provided', () => {
    render(<ConfirmDialog {...defaultProps} title={undefined} />);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });
});
