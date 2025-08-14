import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { HOTKEY_PROFILES, HotkeyProfile } from 'src/config/hotkeys';

export const HotkeySettings = () => {
  const hotkeyProfile = useUiStateStore((state) => state.hotkeyProfile);
  const setHotkeyProfile = useUiStateStore((state) => state.actions.setHotkeyProfile);

  const currentMapping = HOTKEY_PROFILES[hotkeyProfile];

  const tools = [
    { name: 'Select', key: currentMapping.select },
    { name: 'Pan', key: currentMapping.pan },
    { name: 'Add Item', key: currentMapping.addItem },
    { name: 'Rectangle', key: currentMapping.rectangle },
    { name: 'Connector', key: currentMapping.connector },
    { name: 'Text', key: currentMapping.text }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Hotkey Settings
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Hotkey Profile</InputLabel>
        <Select
          value={hotkeyProfile}
          label="Hotkey Profile"
          onChange={(e) => setHotkeyProfile(e.target.value as HotkeyProfile)}
        >
          <MenuItem value="qwerty">QWERTY (Q, W, E, R, T, Y)</MenuItem>
          <MenuItem value="smnrct">SMNRCT (S, M, N, R, C, T)</MenuItem>
          <MenuItem value="none">No Hotkeys</MenuItem>
        </Select>
      </FormControl>

      {hotkeyProfile !== 'none' && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tool</TableCell>
                <TableCell>Hotkey</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tools.map((tool) => (
                <TableRow key={tool.name}>
                  <TableCell>{tool.name}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {tool.key ? tool.key.toUpperCase() : '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Note: Hotkeys work when not typing in text fields
      </Typography>
    </Box>
  );
};