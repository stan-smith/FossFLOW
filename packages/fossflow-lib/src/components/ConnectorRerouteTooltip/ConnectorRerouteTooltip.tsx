import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Paper, Typography, Fade } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useUiStateStore, useUiStateStoreApi } from 'src/stores/uiStateStore';
import { useScene } from 'src/hooks/useScene';
import { useTranslation } from 'src/stores/localeStore';

const STORAGE_KEY = 'fossflow_connector_reroute_hint_dismissed';

export const ConnectorRerouteTooltip = () => {
  const { t } = useTranslation('connectorRerouteTooltip');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const modeType = useUiStateStore((state) => state.mode.type);
  const isConnecting = useUiStateStore((state) =>
    state.mode.type === 'CONNECTOR' ? state.mode.isConnecting : false
  );
  const connectorId = useUiStateStore((state) =>
    state.mode.type === 'CONNECTOR' ? state.mode.id : null
  );
  const storeApi = useUiStateStoreApi();
  const { connectors } = useScene();
  const previousIsConnectingRef = useRef(isConnecting);
  const shownForConnectorRef = useRef<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // Check if the hint has been dismissed before
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed !== 'true') {
      setIsDismissed(false);
    }
  }, []);

  useEffect(() => {
    if (isDismissed) {
      return;
    }

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
        // Show tooltip near the mouse position (read imperatively)
        const currentMousePosition = storeApi.getState().mouse.position.screen;
        setTooltipPosition({
          x: currentMousePosition.x,
          y: currentMousePosition.y
        });
        setShowTooltip(true);
        shownForConnectorRef.current = latestConnector.id;

        // Auto-hide after 15 seconds
        const timer = setTimeout(() => {
          setShowTooltip(false);
        }, 15000);

        return () => clearTimeout(timer);
      }
    }

    // Hide tooltip when switching away from connector mode
    if (modeType !== 'CONNECTOR') {
      setShowTooltip(false);
    }

    previousIsConnectingRef.current = isConnecting;
  }, [modeType, isConnecting, connectorId, connectors, isDismissed, storeApi]);

  const handleDismiss = () => {
    setShowTooltip(false);
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!showTooltip || isDismissed) {
    return null;
  }

  return (
    <Fade in={showTooltip} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          left: Math.min(tooltipPosition.x + 20, window.innerWidth - 370),
          top: Math.min(tooltipPosition.y - 80, window.innerHeight - 120),
          zIndex: 1400, // Above most UI elements
          maxWidth: 340
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 2,
            pr: 5,
            backgroundColor: 'background.paper',
            borderLeft: '4px solid',
            borderLeftColor: 'success.main'
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
            {t('title')}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('instructionStart')}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>{t('instructionSelect')}</strong> {t('instructionMiddle')} <strong>{t('instructionClick')}</strong> {t('instructionAnd')} <strong>{t('instructionDrag')}</strong> {t('instructionEnd')}
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
};
