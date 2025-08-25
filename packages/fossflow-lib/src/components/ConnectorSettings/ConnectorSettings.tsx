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

export const ConnectorSettings = () => {
  const connectorInteractionMode = useUiStateStore((state) => state.connectorInteractionMode);
  const setConnectorInteractionMode = useUiStateStore((state) => state.actions.setConnectorInteractionMode);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConnectorInteractionMode(event.target.value as 'click' | 'drag');
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Connector Settings
      </Typography>
      
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Connection Creation Mode</FormLabel>
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
                  <Typography variant="body1">Click Mode (Recommended)</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click the first node, then click the second node to create a connection
                  </Typography>
                </Box>
              }
            />
            <FormControlLabel
              value="drag"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body1">Drag Mode</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click and drag from the first node to the second node
                  </Typography>
                </Box>
              }
              sx={{ mt: 1 }}
            />
          </RadioGroup>
        </FormControl>
      </Paper>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Note: You can change this setting at any time. The selected mode will be used
        when the Connector tool is active.
      </Typography>
    </Box>
  );
};