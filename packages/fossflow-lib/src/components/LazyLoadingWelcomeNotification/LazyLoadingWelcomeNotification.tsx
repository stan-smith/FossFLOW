import React, { useState, useEffect } from 'react';
import { Box, IconButton, Paper, Typography, useTheme } from '@mui/material';
import { Close as CloseIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useTranslation } from 'src/stores/localeStore';

const STORAGE_KEY = 'fossflow-lazy-loading-welcome-dismissed';

export const LazyLoadingWelcomeNotification = () => {
  const { t } = useTranslation('lazyLoadingWelcome');
  const theme = useTheme();
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // Check if the notification has been dismissed before
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed !== 'true') {
      setIsDismissed(false);
    }
  }, []);

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
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1400, // Above most UI elements
        maxWidth: 600,
        width: '90%'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 3,
          pr: 5,
          backgroundColor: 'background.paper',
          borderLeft: '6px solid',
          borderLeftColor: 'primary.main',
          boxShadow: theme.shadows[20]
        }}
      >
        <IconButton
          size="small"
          onClick={handleDismiss}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          {t('title')}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
          {t('message')}
        </Typography>

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
          p: 1.5,
          bgcolor: 'action.hover',
          borderRadius: 1
        }}>
          <MenuIcon sx={{ color: 'primary.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t('configPath')} <strong>{t('configPath2')}</strong>
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('canDisable')}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontStyle: 'italic',
            fontWeight: 600,
            mt: 2,
            textAlign: 'right'
          }}
        >
          {t('signature')}
        </Typography>
      </Paper>
    </Box>
  );
};
