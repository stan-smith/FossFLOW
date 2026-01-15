import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from 'src/styles/theme';
import { Label } from '../Label';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Label', () => {
  describe('dotted line', () => {
    it('should render dotted line with pointerEvents none to not block clicks', () => {
      const { container } = renderWithTheme(
        <Label maxWidth={200} labelHeight={50}>
          <span>Test Label</span>
        </Label>
      );

      // Find the SVG element (the dotted line container)
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();

      // Check that the SVG has pointerEvents set to none
      const svgStyles = window.getComputedStyle(svg!);
      expect(svgStyles.pointerEvents).toBe('none');
    });

    it('should not render dotted line when labelHeight is 0', () => {
      const { container } = renderWithTheme(
        <Label maxWidth={200} labelHeight={0}>
          <span>Test Label</span>
        </Label>
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeNull();
    });

    it('should not render dotted line when showLine is false', () => {
      const { container } = renderWithTheme(
        <Label maxWidth={200} labelHeight={50} showLine={false}>
          <span>Test Label</span>
        </Label>
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeNull();
    });

    it('should render children correctly', () => {
      renderWithTheme(
        <Label maxWidth={200} labelHeight={50}>
          <span data-testid="label-content">Test Label Content</span>
        </Label>
      );

      expect(screen.getByTestId('label-content')).toHaveTextContent(
        'Test Label Content'
      );
    });
  });
});
