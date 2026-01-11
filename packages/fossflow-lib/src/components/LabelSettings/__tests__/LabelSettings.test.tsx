import React from 'react';
import { render, screen } from '@testing-library/react';
import { LabelSettings } from '../LabelSettings';

const mockSetLabelSettings = jest.fn();
const mockLabelSettings = {
  expandButtonPadding: 0,
  backgroundOpacity: 1.0
};

jest.mock('../../../stores/uiStateStore', () => {
  return {
    useUiStateStore: jest.fn((selector) => {
      const state = {
        labelSettings: mockLabelSettings,
        actions: {
          setLabelSettings: mockSetLabelSettings
        }
      };
      return selector ? selector(state) : state;
    })
  };
});

describe('LabelSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLabelSettings.backgroundOpacity = 1.0;
    mockLabelSettings.expandButtonPadding = 0;
  });

  it('should render background opacity slider', () => {
    render(<LabelSettings />);

    expect(screen.getByText('Background Opacity')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Adjust label background transparency to see nodes behind labels'
      )
    ).toBeInTheDocument();
  });

  it('should render expand button padding slider', () => {
    render(<LabelSettings />);

    expect(screen.getByText('Expand Button Padding')).toBeInTheDocument();
  });

  it('should display current opacity percentage', () => {
    render(<LabelSettings />);

    expect(screen.getByText('Current: 100%')).toBeInTheDocument();
  });

  it('should display current padding value', () => {
    render(<LabelSettings />);

    expect(screen.getByText('Current: 0 theme units')).toBeInTheDocument();
  });
});
