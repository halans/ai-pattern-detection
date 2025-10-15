import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('enables clear button when text exists and clears input on click', async () => {
    const user = userEvent.setup();
    const handleAnalyze = vi.fn();
    const handleClear = vi.fn();

    render(<TextInput onAnalyze={handleAnalyze} onClear={handleClear} isLoading={false} />);

    const textarea = screen.getByLabelText(/enter text to analyze/i) as HTMLTextAreaElement;
    const clearButton = screen.getByRole('button', { name: /clear/i });

    expect(clearButton).toBeDisabled();
    expect(textarea.value).toBe('');

    await act(async () => {
      await user.type(textarea, 'Sample text');
    });

    await waitFor(() => expect(clearButton).toBeEnabled());

    await act(async () => {
      await user.click(clearButton);
    });

    await waitFor(() => expect(clearButton).toBeDisabled());
    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(textarea.value).toBe('');
  });
});
