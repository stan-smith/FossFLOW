import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomColorInput } from '../CustomColorInput';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from 'src/styles/theme';

// Mock ColorPicker since we don't need to test external library behavior
jest.mock('../ColorPicker', () => ({
  ColorPicker: ({ value, onChange }: { value: string; onChange: (color: string) => void }) => (
    <div data-testid="color-picker" onClick={() => onChange('#FFFFFF')}>
      {value}
    </div>
  )
}));

describe('CustomColorInput', () => {
  const defaultProps = {
    value: '#FF0000',
    onChange: jest.fn()
  };

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <CustomColorInput {...defaultProps} {...props} />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial value', () => {
    renderComponent();
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('#FF0000');
    expect(screen.getByTestId('color-picker')).toHaveTextContent('#FF0000');
  });

  it('updates input value on change', () => {
    renderComponent();
    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: '#00FF00' } });
    expect(input.value).toBe('#00FF00');
  });

  it('calls onChange when valid hex is entered', () => {
    const onChange = jest.fn();
    renderComponent({ onChange });
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '#00FF00' } });
    expect(onChange).toHaveBeenCalledWith('#00FF00');
  });

  it('does not call onChange when invalid hex is entered', () => {
    const onChange = jest.fn();
    renderComponent({ onChange });
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'invalid' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('reverts to prop value on blur if input is invalid', () => {
    renderComponent({ value: '#FF0000' });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.blur(input);
    
    expect(input.value).toBe('#FF0000');
  });

  it('keeps valid value on blur', () => {
    const onChange = jest.fn();
    renderComponent({ value: '#FF0000', onChange });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: '#00FF00' } });
    fireEvent.blur(input);
    
    expect(input.value).toBe('#00FF00');
    expect(onChange).toHaveBeenCalledWith('#00FF00');
  });

  it('updates local state when prop value changes', () => {
    const { rerender } = renderComponent({ value: '#FF0000' });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('#FF0000');

    rerender(
      <ThemeProvider theme={theme}>
        <CustomColorInput {...defaultProps} value="#0000FF" />
      </ThemeProvider>
    );
    expect(input.value).toBe('#0000FF');
  });

  describe('EyeDropper interaction', () => {
    beforeAll(() => {
      // Mock EyeDropper API
      Object.defineProperty(window, 'EyeDropper', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          open: jest.fn().mockResolvedValue({ sRGBHex: '#123456' })
        }))
      });
    });

    afterAll(() => {
      // @ts-ignore
      delete window.EyeDropper;
    });

    it('renders eyedropper button when API is supported', () => {
      renderComponent();
      expect(screen.getByRole('button', { name: /pick color/i })).toBeInTheDocument();
    });

    it('calls onChange with picked color', async () => {
      const onChange = jest.fn();
      renderComponent({ onChange });
      
      const button = screen.getByRole('button', { name: /pick color/i });
      await act(async () => {
        fireEvent.click(button);
      });

      expect(onChange).toHaveBeenCalledWith('#123456');
    });

    it('handles EyeDropper cancellation gracefully', async () => {
      const onChange = jest.fn();
      // Mock rejection (user cancelled)
      (window.EyeDropper as any).mockImplementation(() => ({
        open: jest.fn().mockRejectedValue(new Error('Canceled'))
      }));

      renderComponent({ onChange });
      
      const button = screen.getByRole('button', { name: /pick color/i });
      await act(async () => {
        fireEvent.click(button);
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('EyeDropper unsupported', () => {
    beforeAll(() => {
      // @ts-ignore
      window.EyeDropper = undefined;
    });

    it('does not render eyedropper button when API is not supported', () => {
      renderComponent();
      expect(screen.queryByRole('button', { name: /pick color/i })).not.toBeInTheDocument();
    });
  });
});
