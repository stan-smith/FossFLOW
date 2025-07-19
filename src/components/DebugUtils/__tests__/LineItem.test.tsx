import React from 'react';
import { render, screen } from '@testing-library/react';
import { LineItem } from '../LineItem';

describe('LineItem', () => {
  it('renders title and value', () => {
    render(<LineItem title="Test Title" value="Test Value" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <LineItem title="Snapshot Title" value="Snapshot Value" />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
