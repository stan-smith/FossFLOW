import React from 'react';
import { Box, Typography, Slider } from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';

export const LabelSettings = () => {
  const labelSettings = useUiStateStore((state) => {
    return state.labelSettings;
  });
  const setLabelSettings = useUiStateStore((state) => {
    return state.actions.setLabelSettings;
  });

  const handlePaddingChange = (_event: Event, value: number | number[]) => {
    setLabelSettings({
      ...labelSettings,
      expandButtonPadding: value as number
    });
  };

  const handleOpacityChange = (_event: Event, value: number | number[]) => {
    setLabelSettings({
      ...labelSettings,
      backgroundOpacity: (value as number) / 100
    });
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure label display settings
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Background Opacity
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: 'block' }}
        >
          Adjust label background transparency to see nodes behind labels
        </Typography>
        <Slider
          value={Math.round(labelSettings.backgroundOpacity * 100)}
          onChange={handleOpacityChange}
          min={0}
          max={100}
          step={10}
          marks
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => {
            return `${value}%`;
          }}
          sx={{ mt: 2 }}
        />
        <Typography variant="caption" color="text.secondary">
          Current: {Math.round(labelSettings.backgroundOpacity * 100)}%
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Expand Button Padding
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: 'block' }}
        >
          Bottom padding when expand button is visible (prevents text overlap)
        </Typography>
        <Slider
          value={labelSettings.expandButtonPadding}
          onChange={handlePaddingChange}
          min={0}
          max={8}
          step={0.5}
          marks
          valueLabelDisplay="auto"
          sx={{ mt: 2 }}
        />
        <Typography variant="caption" color="text.secondary">
          Current: {labelSettings.expandButtonPadding} theme units
        </Typography>
      </Box>
    </Box>
  );
};
