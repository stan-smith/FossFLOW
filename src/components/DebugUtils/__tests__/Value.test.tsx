import React from 'react';
import { render, screen } from '@testing-library/react';
import { Value } from '../Value';

describe('Value', () => {
  it('renders value', () => {
    render(<Value value="Test Value" />);
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Value value="Snapshot Value" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
