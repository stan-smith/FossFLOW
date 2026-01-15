import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from 'src/styles/theme';
import { LineItem } from '../LineItem';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('LineItem', () => {
  it('renders title and value', () => {
    renderWithTheme(<LineItem title="Test Title" value="Test Value" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = renderWithTheme(
      <LineItem title="Snapshot Title" value="Snapshot Value" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
