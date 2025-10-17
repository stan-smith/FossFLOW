import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Paper
} from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useTranslation } from 'src/stores/localeStore';

export const ConnectorSettings = () => {
  const connectorInteractionMode = useUiStateStore((state) => state.connectorInteractionMode);
  const setConnectorInteractionMode = useUiStateStore((state) => state.actions.setConnectorInteractionMode);
  const { t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConnectorInteractionMode(event.target.value as 'click' | 'drag');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('settings.connector.title')}
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">{t('settings.connector.connectionMode')}</FormLabel>
          <RadioGroup
            value={connectorInteractionMode}
            onChange={handleChange}
            sx={{ mt: 1 }}
          >
            <FormControlLabel
              value="click"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body1">{t('settings.connector.clickMode')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('settings.connector.clickModeDesc')}
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="drag"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body1">{t('settings.connector.dragMode')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('settings.connector.dragModeDesc')}
                  </Typography>
                </Box>
              }
              sx={{ mt: 1 }}
            />
          </RadioGroup>
        </FormControl>
      </Paper>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {t('settings.connector.note')}
      </Typography>
    </Box>
  );
};