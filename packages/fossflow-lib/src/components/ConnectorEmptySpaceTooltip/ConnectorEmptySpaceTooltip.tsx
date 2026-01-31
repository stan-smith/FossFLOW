import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Fade } from '@mui/material';
import { useUiStateStore, useUiStateStoreApi } from 'src/stores/uiStateStore';
import { useScene } from 'src/hooks/useScene';
import { useTranslation } from 'src/stores/localeStore';

export const ConnectorEmptySpaceTooltip = () => {
  const { t } = useTranslation('connectorEmptySpaceTooltip');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const modeType = useUiStateStore((state) => state.mode.type);
  const isConnecting = useUiStateStore((state) =>
    state.mode.type === 'CONNECTOR' ? state.mode.isConnecting : false
  );
  const connectorId = useUiStateStore((state) =>
    state.mode.type === 'CONNECTOR' ? state.mode.id : null
  );
  // Get store API for imperative access to mouse position (without subscribing)
  const storeApi = useUiStateStoreApi();

  const { connectors } = useScene();
  const previousIsConnectingRef = useRef(isConnecting);
  const shownForConnectorRef = useRef<string | null>(null);

  useEffect(() => {
    const wasConnecting = previousIsConnectingRef.current;

    // Detect when we transition from isConnecting to not isConnecting (connection completed)
    if (
      modeType === 'CONNECTOR' &&
      wasConnecting &&
      !isConnecting &&
      !connectorId // After connection is complete, id is set to null
    ) {
      // Find the most recently created connector
      const latestConnector = connectors[connectors.length - 1];

      if (latestConnector && latestConnector.id !== shownForConnectorRef.current) {
        // Check if either end is connected to empty space (tile reference)
        const hasEmptySpaceConnection = latestConnector.anchors.some(
          anchor => anchor.ref.tile && !anchor.ref.item
        );

        if (hasEmptySpaceConnection) {
          // Show tooltip near the mouse position (read imperatively to avoid subscribing)
          const currentMousePosition = storeApi.getState().mouse.position.screen;
          setTooltipPosition({
            x: currentMousePosition.x,
            y: currentMousePosition.y
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
    if (modeType !== 'CONNECTOR') {
      setShowTooltip(false);
    }

    previousIsConnectingRef.current = isConnecting;
  }, [modeType, isConnecting, connectorId, connectors, storeApi]);

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
            {t('message')} <strong>{t('instruction')}</strong>
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
};