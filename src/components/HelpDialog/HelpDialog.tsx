import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { DialogTypeEnum } from 'src/types/ui';

interface ShortcutItem {
  action: string;
  shortcut: string;
  description: string;
}

const keyboardShortcuts: ShortcutItem[] = [
  {
    action: 'Undo',
    shortcut: 'Ctrl+Z',
    description: 'Undo the last action'
  },
  {
    action: 'Redo',
    shortcut: 'Ctrl+Y',
    description: 'Redo the last undone action'
  },
  {
    action: 'Redo (Alternative)',
    shortcut: 'Ctrl+Shift+Z',
    description: 'Alternative redo shortcut'
  },
  {
    action: 'Help',
    shortcut: 'F1',
    description: 'Open help dialog with keyboard shortcuts'
  },
  {
    action: 'Zoom In',
    shortcut: 'Mouse Wheel Up',
    description: 'Zoom in on the canvas'
  },
  {
    action: 'Zoom Out',
    shortcut: 'Mouse Wheel Down',
    description: 'Zoom out from the canvas'
  },
  {
    action: 'Pan Canvas',
    shortcut: 'Left-click + Drag',
    description: 'Pan the canvas when in Pan mode'
  },
  {
    action: 'Context Menu',
    shortcut: 'Right-click',
    description: 'Open context menu for items or empty space'
  }
];

const mouseInteractions: ShortcutItem[] = [
  {
    action: 'Select Tool',
    shortcut: 'Click Select button',
    description: 'Switch to selection mode'
  },
  {
    action: 'Pan Tool',
    shortcut: 'Click Pan button',
    description: 'Switch to pan mode for moving canvas'
  },
  {
    action: 'Add Item',
    shortcut: 'Click Add item button',
    description: 'Open icon picker to add new items'
  },
  {
    action: 'Draw Rectangle',
    shortcut: 'Click Rectangle button',
    description: 'Switch to rectangle drawing mode'
  },
  {
    action: 'Create Connector',
    shortcut: 'Click Connector button',
    description: 'Switch to connector mode'
  },
  {
    action: 'Add Text',
    shortcut: 'Click Text button',
    description: 'Create a new text box'
  }
];

export const HelpDialog = () => {
  const dialog = useUiStateStore((state) => {
    return state.dialog;
  });
  const setDialog = useUiStateStore((state) => {
    return state.actions.setDialog;
  });

  const isOpen = dialog === DialogTypeEnum.HELP;

  const handleClose = () => {
    setDialog(null);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '60vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div">
            Keyboard Shortcuts & Help
          </Typography>
          <Button
            onClick={handleClose}
            sx={{
              minWidth: 'auto',
              p: 1,
              bgcolor: 'transparent',
              boxShadow: 'none',
              '&:hover': { bgcolor: 'transparent' },
              '&:focus': { bgcolor: 'transparent' },
              '&:active': { bgcolor: 'transparent' }
            }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Keyboard Shortcuts
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Shortcut</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keyboardShortcuts.map((shortcut, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{shortcut.action}</TableCell>
                      <TableCell>
                        <code
                          style={{
                            backgroundColor: '#f5f5f5',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontFamily: 'monospace'
                          }}
                        >
                          {shortcut.shortcut}
                        </code>
                      </TableCell>
                      <TableCell>{shortcut.description}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Mouse Interactions
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mouseInteractions.map((interaction, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{interaction.action}</TableCell>
                      <TableCell>
                        <code
                          style={{
                            backgroundColor: '#f5f5f5',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontFamily: 'monospace'
                          }}
                        >
                          {interaction.shortcut}
                        </code>
                      </TableCell>
                      <TableCell>{interaction.description}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            <strong>Note:</strong> Keyboard shortcuts are disabled when typing
            in input fields, text areas, or content-editable elements to prevent
            conflicts.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
