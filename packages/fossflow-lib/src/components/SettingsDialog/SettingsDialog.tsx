import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { HotkeySettings } from '../HotkeySettings/HotkeySettings';
import { PanSettings } from '../PanSettings/PanSettings';
import { ConnectorSettings } from '../ConnectorSettings/ConnectorSettings';

export const SettingsDialog = () => {
  const dialog = useUiStateStore((state) => state.dialog);
  const setDialog = useUiStateStore((state) => state.actions.setDialog);
  const [tabValue, setTabValue] = useState(0);

  const isOpen = dialog === 'SETTINGS';

  const handleClose = () => {
    setDialog(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Settings
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Hotkeys" />
          <Tab label="Pan Controls" />
          <Tab label="Connectors" />
        </Tabs>
        
        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && <HotkeySettings />}
          {tabValue === 1 && <PanSettings />}
          {tabValue === 2 && <ConnectorSettings />}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};