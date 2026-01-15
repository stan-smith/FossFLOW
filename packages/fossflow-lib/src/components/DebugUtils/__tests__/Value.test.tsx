import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from 'src/styles/theme';
import { Value } from '../Value';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('Value', () => {
  it('renders value', () => {
    renderWithTheme(<Value value="Test Value" />);
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = renderWithTheme(<Value value="Snapshot Value" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
