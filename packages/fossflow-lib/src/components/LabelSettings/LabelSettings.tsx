import React from 'react';
import {
  Box,
  Typography,
  Slider
} from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useTranslation } from 'src/stores/localeStore';

export const LabelSettings = () => {
  const labelSettings = useUiStateStore((state) => state.labelSettings);
  const setLabelSettings = useUiStateStore((state) => state.actions.setLabelSettings);
  const { t } = useTranslation('labelSettings');

  const handlePaddingChange = (_event: Event, value: number | number[]) => {
    setLabelSettings({
      ...labelSettings,
      expandButtonPadding: value as number
    });
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('description')}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          {t('expandButtonPadding')}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          {t('expandButtonPaddingDesc')}
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
          {t('current').replace('{{value}}', String(labelSettings.expandButtonPadding))}
        </Typography>
      </Box>
    </Box>
  );
};
