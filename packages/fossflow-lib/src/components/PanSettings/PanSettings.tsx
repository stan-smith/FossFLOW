import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Slider,
  Paper,
  Divider
} from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useTranslation } from 'src/stores/localeStore';

export const PanSettings = () => {
  const panSettings = useUiStateStore((state) => state.panSettings);
  const setPanSettings = useUiStateStore((state) => state.actions.setPanSettings);
  const { t } = useTranslation();

  const handleToggle = (setting: keyof typeof panSettings) => {
    if (typeof panSettings[setting] === 'boolean') {
      setPanSettings({
        ...panSettings,
        [setting]: !panSettings[setting]
      });
    }
  };

  const handleSpeedChange = (value: number) => {
    setPanSettings({
      ...panSettings,
      keyboardPanSpeed: value
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('settings.pan.title')}
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('settings.pan.mousePanOptions')}
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={panSettings.emptyAreaClickPan}
              onChange={() => handleToggle('emptyAreaClickPan')}
            />
          }
          label={t('settings.pan.emptyAreaClickPan')}
        />

        <FormControlLabel
          control={
            <Switch
              checked={!panSettings.middleClickPan}
              onChange={() => handleToggle('middleClickPan')}
            />
          }
          label={t('settings.pan.middleClickPan')}
        />

        <FormControlLabel
          control={
            <Switch
              checked={!panSettings.rightClickPan}
              onChange={() => handleToggle('rightClickPan')}
            />
          }
          label={t('settings.pan.rightClickPan')}
        />

        <FormControlLabel
          control={
            <Switch
              checked={!panSettings.ctrlClickPan}
              onChange={() => handleToggle('ctrlClickPan')}
            />
          }
          label={t('settings.pan.ctrlClickPan')}
        />

        <FormControlLabel
          control={
            <Switch
              checked={!panSettings.altClickPan}
              onChange={() => handleToggle('altClickPan')}
            />
          }
          label={t('settings.pan.altClickPan')}
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('settings.pan.keyboardPanOptions')}
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={panSettings.arrowKeysPan}
              onChange={() => handleToggle('arrowKeysPan')}
            />
          }
          label={t('settings.pan.arrowKeys')}
        />

        <FormControlLabel
          control={
            <Switch
              checked={panSettings.wasdPan}
              onChange={() => handleToggle('wasdPan')}
            />
          }
          label={t('settings.pan.wasdKeys')}
        />

        <FormControlLabel
          control={
            <Switch
              checked={panSettings.ijklPan}
              onChange={() => handleToggle('ijklPan')}
            />
          }
          label={t('settings.pan.ijklKeys')}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          {t('settings.pan.keyboardPanSpeed')}
        </Typography>

        <Box sx={{ px: 2 }}>
          <Slider
            value={panSettings.keyboardPanSpeed}
            onChange={(_, value) => handleSpeedChange(value as number)}
            min={5}
            max={50}
            step={5}
            marks
            valueLabelDisplay="auto"
          />
        </Box>
      </Paper>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        {t('settings.pan.note')}
      </Typography>
    </Box>
  );
};