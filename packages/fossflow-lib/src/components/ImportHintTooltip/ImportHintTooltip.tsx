import React, { useState, useEffect } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { Close as CloseIcon, FolderOpen as FolderOpenIcon } from '@mui/icons-material';
import { useTranslation } from 'src/stores/localeStore';

const STORAGE_KEY = 'fossflow_import_hint_dismissed';

export const ImportHintTooltip = () => {
  const { t } = useTranslation('importHintTooltip');
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // Check if the hint has been dismissed before
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
        top: 90,
        left: 16,
        zIndex: 1300, // Above most UI elements
        maxWidth: 280
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 2,
          pr: 5,
          backgroundColor: 'background.paper',
          borderLeft: '4px solid',
          borderLeftColor: 'info.main'
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <FolderOpenIcon sx={{ mr: 1, color: 'info.main' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {t('title')}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {t('instructionStart')} <strong>{t('menuButton')}</strong> {t('instructionMiddle')} <strong>{t('openButton')}</strong> {t('instructionEnd')}
        </Typography>
      </Paper>
    </Box>
  );
};