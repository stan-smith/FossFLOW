import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper
} from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useTranslation } from 'src/stores/localeStore';

export const PerspectiveSettings = () => {
  const perspectiveMode = useUiStateStore((state) => state.perspectiveMode);
  const setPerspectiveMode = useUiStateStore((state) => state.actions.setPerspectiveMode);
  const { t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerspectiveMode(event.target.value as 'isometric' | '2d');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('settings.perspective.title')}
      </Typography>

      <Paper sx={{ p: 2 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            {t('settings.perspective.mode')}
          </FormLabel>
          <RadioGroup
            value={perspectiveMode}
            onChange={handleChange}
            sx={{ mt: 1 }}
          >
            <FormControlLabel
              value="isometric"
              control={<Radio />}
              label={t('settings.perspective.isometric')}
            />
            <FormControlLabel
              value="2d"
              control={<Radio />}
              label={t('settings.perspective.2d')}
            />
          </RadioGroup>
        </FormControl>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          {t('settings.perspective.description')}
        </Typography>
      </Paper>
    </Box>
  );
};

