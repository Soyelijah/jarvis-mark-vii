import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NotificationToast from '../NotificationToast';

describe('NotificationToast Component', () => {
  it('renders notification with correct message', () => {
    const notification = {
      id: '1',
      type: 'success',
      message: 'Task completed successfully',
    };

    render(<NotificationToast notification={notification} onClose={() => {}} />);

    expect(screen.getByText('Task completed successfully')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    const notification = {
      id: '1',
      type: 'success',
      message: 'Test notification',
    };

    render(<NotificationToast notification={notification} onClose={onClose} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledWith('1');
  });

  it('applies correct styling for success type', () => {
    const notification = {
      id: '1',
      type: 'success',
      message: 'Success message',
    };

    const { container } = render(
      <NotificationToast notification={notification} onClose={() => {}} />
    );

    // Check for success-related classes or styles
    expect(container.firstChild).toHaveClass(/success/i);
  });

  it('applies correct styling for error type', () => {
    const notification = {
      id: '1',
      type: 'error',
      message: 'Error message',
    };

    const { container } = render(
      <NotificationToast notification={notification} onClose={() => {}} />
    );

    // Check for error-related classes or styles
    expect(container.firstChild).toHaveClass(/error/i);
  });
});
