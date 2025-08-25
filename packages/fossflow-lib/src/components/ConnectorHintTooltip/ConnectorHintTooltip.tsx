import React, { useState, useEffect } from 'react';
import { Box, IconButton, Paper, Typography, useTheme } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useUiStateStore } from 'src/stores/uiStateStore';

const STORAGE_KEY = 'fossflow_connector_hint_dismissed';

interface Props {
  toolMenuRef?: React.RefObject<HTMLElement>;
}

export const ConnectorHintTooltip = ({ toolMenuRef }: Props) => {
  const theme = useTheme();
  const connectorInteractionMode = useUiStateStore((state) => state.connectorInteractionMode);
  const mode = useUiStateStore((state) => state.mode);
  const [isDismissed, setIsDismissed] = useState(true);
  const [position, setPosition] = useState({ top: 16, right: 16 });

  useEffect(() => {
    // Check if the hint has been dismissed before
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed !== 'true') {
      setIsDismissed(false);
    }
  }, []);

  useEffect(() => {
    // Calculate position based on toolbar
    if (toolMenuRef?.current) {
      const toolMenuRect = toolMenuRef.current.getBoundingClientRect();
      // Position tooltip below the toolbar with some spacing
      setPosition({
        top: toolMenuRect.bottom + 16,
        right: 16
      });
    } else {
      // Fallback position if no toolbar ref
      const appPadding = theme.customVars?.appPadding || { x: 16, y: 16 };
      setPosition({
        top: appPadding.y + 500, // Approximate toolbar height
        right: appPadding.x
      });
    }
  }, [toolMenuRef, theme]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (isDismissed) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: position.top,
        right: position.right,
        zIndex: 1300, // Above most UI elements
        maxWidth: 320
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 2,
          pr: 5,
          backgroundColor: 'background.paper',
          borderLeft: '4px solid',
          borderLeftColor: 'primary.main'
        }}
      >
        <IconButton
          size="small"
          onClick={handleDismiss}
          sx={{
            position: 'absolute',
            right: 4,
            top: 4
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          {connectorInteractionMode === 'click' ? 'Tip: Creating Connectors' : 'Tip: Connector Tools'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {connectorInteractionMode === 'click' ? (
            <>
              <strong>Click</strong> on the first node or point, then <strong>click</strong> on 
              the second node or point to create a connection.
              {mode.type === 'CONNECTOR' && mode.isConnecting && (
                <Box component="span" sx={{ display: 'block', mt: 1, color: 'primary.main' }}>
                  Now click on the target to complete the connection.
                </Box>
              )}
            </>
          ) : (
            <>
              <strong>Drag</strong> from the first node to the second node to create a connection.
            </>
          )}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          To reroute a connector, <strong>left-click</strong> on any point 
          along the connector line and drag to create or move anchor points.
        </Typography>
      </Paper>
    </Box>
  );
};