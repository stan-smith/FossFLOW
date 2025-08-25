import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Fade } from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { useScene } from 'src/hooks/useScene';

export const ConnectorEmptySpaceTooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const mode = useUiStateStore((state) => state.mode);
  const mouse = useUiStateStore((state) => state.mouse);
  const { connectors } = useScene();
  const previousModeRef = useRef(mode);
  const shownForConnectorRef = useRef<string | null>(null);

  useEffect(() => {
    const previousMode = previousModeRef.current;
    
    // Detect when we transition from isConnecting to not isConnecting (connection completed)
    if (
      mode.type === 'CONNECTOR' &&
      previousMode.type === 'CONNECTOR' &&
      previousMode.isConnecting &&
      !mode.isConnecting &&
      !mode.id // After connection is complete, id is set to null
    ) {
      // Find the most recently created connector
      const latestConnector = connectors[connectors.length - 1];
      
      if (latestConnector && latestConnector.id !== shownForConnectorRef.current) {
        // Check if either end is connected to empty space (tile reference)
        const hasEmptySpaceConnection = latestConnector.anchors.some(
          anchor => anchor.ref.tile && !anchor.ref.item
        );
        
        if (hasEmptySpaceConnection) {
          // Show tooltip near the mouse position
          setTooltipPosition({
            x: mouse.position.screen.x,
            y: mouse.position.screen.y
          });
          setShowTooltip(true);
          shownForConnectorRef.current = latestConnector.id;
          
          // Auto-hide after 12 seconds
          const timer = setTimeout(() => {
            setShowTooltip(false);
          }, 12000);
          
          return () => clearTimeout(timer);
        }
      }
    }
    
    // Hide tooltip when switching away from connector mode
    if (mode.type !== 'CONNECTOR') {
      setShowTooltip(false);
    }
    
    previousModeRef.current = mode;
  }, [mode, connectors, mouse.position.screen]);

  // Remove the click handler - tooltip should persist
  // It will only hide after timeout or mode change

  if (!showTooltip) {
    return null;
  }

  return (
    <Fade in={showTooltip} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          left: Math.min(tooltipPosition.x + 20, window.innerWidth - 350),
          top: Math.min(tooltipPosition.y - 60, window.innerHeight - 100),
          zIndex: 1400, // Above most UI elements
          pointerEvents: 'none' // Don't block interactions
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 2,
            maxWidth: 320,
            backgroundColor: 'background.paper',
            borderLeft: '4px solid',
            borderLeftColor: 'info.main'
          }}
        >
          <Typography variant="body2">
            To connect this connector to a node, <strong>left-click on the end of the connector</strong> and drag it to the desired node.
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
};