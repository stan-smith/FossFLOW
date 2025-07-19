import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from 'src/styles/theme';
import { ModelProvider } from 'src/stores/modelStore';
import { SceneProvider } from 'src/stores/sceneStore';
import { UiStateProvider } from 'src/stores/uiStateStore';
import { SizeIndicator } from '../SizeIndicator';

describe('SizeIndicator', () => {
  const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <ThemeProvider theme={theme}>
        <ModelProvider>
          <SceneProvider>
            <UiStateProvider>{children}</UiStateProvider>
          </SceneProvider>
        </ModelProvider>
      </ThemeProvider>
    );
  };

  it('renders without crashing', () => {
    const { container } = render(
      <Providers>
        <SizeIndicator />
      </Providers>
    );
    const box = container.querySelector('div');
    expect(box).toBeInTheDocument();
    expect(box).toHaveStyle('border: 6px solid red');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <Providers>
        <SizeIndicator />
      </Providers>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
