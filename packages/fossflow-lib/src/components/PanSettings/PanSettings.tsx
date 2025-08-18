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

export const PanSettings = () => {
  const panSettings = useUiStateStore((state) => state.panSettings);
  const setPanSettings = useUiStateStore((state) => state.actions.setPanSettings);

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
        Pan Settings
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Mouse Pan Options
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={panSettings.emptyAreaClickPan}
              onChange={() => handleToggle('emptyAreaClickPan')}
            />
          }
          label="Click and drag on empty area"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={!panSettings.middleClickPan}
              onChange={() => handleToggle('middleClickPan')}
            />
          }
          label="Middle click and drag"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={!panSettings.rightClickPan}
              onChange={() => handleToggle('rightClickPan')}
            />
          }
          label="Right click and drag"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={!panSettings.ctrlClickPan}
              onChange={() => handleToggle('ctrlClickPan')}
            />
          }
          label="Ctrl + click and drag"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={!panSettings.altClickPan}
              onChange={() => handleToggle('altClickPan')}
            />
          }
          label="Alt + click and drag"
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Keyboard Pan Options
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={panSettings.arrowKeysPan}
              onChange={() => handleToggle('arrowKeysPan')}
            />
          }
          label="Arrow keys"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={panSettings.wasdPan}
              onChange={() => handleToggle('wasdPan')}
            />
          }
          label="WASD keys"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={panSettings.ijklPan}
              onChange={() => handleToggle('ijklPan')}
            />
          }
          label="IJKL keys"
        />
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Keyboard Pan Speed
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
        Note: Pan options work in addition to the dedicated Pan tool
      </Typography>
    </Box>
  );
};