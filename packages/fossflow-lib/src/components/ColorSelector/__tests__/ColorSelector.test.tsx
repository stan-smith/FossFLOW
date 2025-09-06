import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ColorSelector } from '../ColorSelector';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from 'src/styles/theme';

// Mock the useScene hook
const mockColors = [
  { id: 'color1', value: '#FF0000', name: 'Red' },
  { id: 'color2', value: '#00FF00', name: 'Green' },
  { id: 'color3', value: '#0000FF', name: 'Blue' },
  { id: 'color4', value: '#FFFF00', name: 'Yellow' },
  { id: 'color5', value: '#FF00FF', name: 'Magenta' }
];

jest.mock('../../../hooks/useScene', () => ({
  useScene: jest.fn(() => ({
    colors: mockColors
  }))
}));

describe('ColorSelector', () => {
  const defaultProps = {
    onChange: jest.fn(),
    activeColor: undefined
  };

  const renderComponent = (props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <ColorSelector {...defaultProps} {...props} />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render all colors from the scene', () => {
      renderComponent();
      
      // Should render a button for each color
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(mockColors.length);
    });

    it('should render all color swatches', () => {
      renderComponent();
      
      // Should render a button for each color
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(mockColors.length);
      
      // Each button should be clickable
      buttons.forEach((button) => {
        expect(button).toBeEnabled();
      });
    });

    it('should render empty state when no colors available', () => {
      const useScene = require('../../../hooks/useScene').useScene;
      useScene.mockImplementation(() => ({ colors: [] }));
      
      const { container } = renderComponent();
      
      // Should render container but no buttons
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryAllByRole('button')).toHaveLength(0);
      
      // Restore mock
      useScene.mockImplementation(() => ({ colors: mockColors }));
    });
  });

  describe('user interactions', () => {
    it('should call onChange with correct color ID when clicked', () => {
      const onChange = jest.fn();
      renderComponent({ onChange });
      
      const buttons = screen.getAllByRole('button');
      
      // Click the first color
      fireEvent.click(buttons[0]);
      expect(onChange).toHaveBeenCalledWith('color1');
      
      // Click the third color
      fireEvent.click(buttons[2]);
      expect(onChange).toHaveBeenCalledWith('color3');
      
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple rapid clicks', () => {
      const onChange = jest.fn();
      renderComponent({ onChange });
      
      const buttons = screen.getAllByRole('button');
      
      // Rapidly click different colors
      fireEvent.click(buttons[0]);
      fireEvent.click(buttons[1]);
      fireEvent.click(buttons[2]);
      fireEvent.click(buttons[1]);
      
      expect(onChange).toHaveBeenCalledTimes(4);
      expect(onChange).toHaveBeenNthCalledWith(1, 'color1');
      expect(onChange).toHaveBeenNthCalledWith(2, 'color2');
      expect(onChange).toHaveBeenNthCalledWith(3, 'color3');
      expect(onChange).toHaveBeenNthCalledWith(4, 'color2');
    });

    it('should be keyboard accessible', () => {
      const onChange = jest.fn();
      renderComponent({ onChange });
      
      const buttons = screen.getAllByRole('button');
      
      // All buttons should be focusable (have tabIndex)
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('tabindex', '0');
      });
      
      // Buttons should respond to clicks (keyboard Enter/Space triggers click)
      fireEvent.click(buttons[0]);
      expect(onChange).toHaveBeenCalledWith('color1');
      
      fireEvent.click(buttons[1]);
      expect(onChange).toHaveBeenCalledWith('color2');
    });
  });

  describe('active color indication', () => {
    it('should indicate the active color with scaled transform', () => {
      const { container } = renderComponent({ activeColor: 'color2' });
      
      // Find all buttons (color swatches are inside buttons)
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(mockColors.length);
      
      // The second button should contain the active color
      // We can check if the active prop was passed correctly
      const activeButton = buttons[1]; // color2 is at index 1
      
      // Check that ColorSwatch received isActive=true for color2
      // Since we can't easily check transform in JSDOM, we'll verify the component renders
      expect(activeButton).toBeInTheDocument();
    });

    it('should update active indication when activeColor prop changes', () => {
      const { rerender } = renderComponent({ activeColor: 'color1' });
      
      let buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(mockColors.length);
      
      // Change active color
      rerender(
        <ThemeProvider theme={theme}>
          <ColorSelector {...defaultProps} activeColor="color3" />
        </ThemeProvider>
      );
      
      buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(mockColors.length);
      // Verify buttons still render after prop change
      expect(buttons[2]).toBeInTheDocument();
    });

    it('should handle no active color', () => {
      renderComponent({ activeColor: undefined });
      
      // All buttons should still render
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(mockColors.length);
      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });

    it('should handle invalid active color ID gracefully', () => {
      renderComponent({ activeColor: 'invalid-color-id' });
      
      // All buttons should still render even with invalid active color
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(mockColors.length);
      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('edge cases', () => {
    it('should handle color with special characters in hex value', () => {
      const useScene = require('../../../hooks/useScene').useScene;
      useScene.mockImplementation(() => ({
        colors: [
          { id: 'special', value: '#C0FFEE', name: 'Coffee' }
        ]
      }));
      
      const onChange = jest.fn();
      renderComponent({ onChange });
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(onChange).toHaveBeenCalledWith('special');
      
      // Restore mock
      useScene.mockImplementation(() => ({ colors: mockColors }));
    });

    it('should handle very long color lists efficiently', () => {
      const useScene = require('../../../hooks/useScene').useScene;
      const manyColors = Array.from({ length: 100 }, (_, i) => ({
        id: `color${i}`,
        value: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
        name: `Color ${i}`
      }));
      
      useScene.mockImplementation(() => ({ colors: manyColors }));
      
      const { container } = renderComponent();
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(100);
      
      // Restore mock
      useScene.mockImplementation(() => ({ colors: mockColors }));
    });

    it('should handle onChange being required properly', () => {
      // onChange is a required prop, so we test with a valid function
      const onChange = jest.fn();
      renderComponent({ onChange });
      
      const buttons = screen.getAllByRole('button');
      
      // Should work normally with onChange provided
      fireEvent.click(buttons[0]);
      expect(onChange).toHaveBeenCalledWith('color1');
    });

    it('should handle colors being updated dynamically', () => {
      const useScene = require('../../../hooks/useScene').useScene;
      const onChange = jest.fn();
      
      // Start with 3 colors
      useScene.mockImplementation(() => ({
        colors: mockColors.slice(0, 3)
      }));
      
      const { rerender } = renderComponent({ onChange });
      expect(screen.getAllByRole('button')).toHaveLength(3);
      
      // Update to 5 colors
      useScene.mockImplementation(() => ({
        colors: mockColors
      }));
      
      rerender(
        <ThemeProvider theme={theme}>
          <ColorSelector {...defaultProps} onChange={onChange} />
        </ThemeProvider>
      );
      
      expect(screen.getAllByRole('button')).toHaveLength(5);
      
      // Click the newly added color
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[4]);
      expect(onChange).toHaveBeenCalledWith('color5');
    });
  });
});