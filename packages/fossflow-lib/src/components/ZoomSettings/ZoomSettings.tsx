import React from 'react';
import {
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useLocale } from 'src/stores/localeStore';

export const ZoomSettings = () => {
  const zoomSettings = useUiStateStore((state) => state.zoomSettings);
  const setZoomSettings = useUiStateStore((state) => state.actions.setZoomSettings);
  const locale = useLocale();

  const handleToggle = (setting: keyof typeof zoomSettings) => {
    setZoomSettings({
      ...zoomSettings,
      [setting]: !zoomSettings[setting]
    });
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {locale.settings.zoom.description}
      </Typography>

      <FormControl component="fieldset" variant="standard">
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={zoomSettings.zoomToCursor}
                onChange={() => handleToggle('zoomToCursor')}
              />
            }
            label={
              <Box>
                <Typography variant="body1">
                  {locale.settings.zoom.zoomToCursor}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {locale.settings.zoom.zoomToCursorDesc}
                </Typography>
              </Box>
            }
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
};
