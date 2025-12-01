import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  VerticalAlignCenter,
  FormatAlignCenter,
  MoveToInbox,
  VerticalAlignTop
} from '@mui/icons-material';
import { ItemReference } from 'src/types';
import { useScene } from 'src/hooks/useScene';
import { useTranslation } from 'src/stores/localeStore';
import {
  distributeHorizontally,
  distributeVertically,
  bringToFront,
  sendToBack
} from 'src/utils/arrangement';

interface Props {
  items: ItemReference[];
}

export const ArrangementTools = ({ items }: Props) => {
  const scene = useScene();
  const { t } = useTranslation();

  const handleDistributeHorizontally = () => {
    if (items.length >= 3) {
      distributeHorizontally(items, scene);
    }
  };

  const handleDistributeVertically = () => {
    if (items.length >= 3) {
      distributeVertically(items, scene);
    }
  };

  const handleBringToFront = () => {
    if (items.length === 1) {
      bringToFront(items[0].id, items[0].type, scene);
    }
  };

  const handleSendToBack = () => {
    if (items.length === 1) {
      sendToBack(items[0].id, items[0].type, scene);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        alignItems: 'center',
        borderRight: 1,
        borderColor: 'divider',
        pr: 1,
        mr: 1
      }}
    >
      {items.length >= 3 && (
        <>
          <Tooltip title={t('floatingToolbar.arrange.distributeHorizontal') || 'Distribute Horizontally'}>
            <IconButton size="small" onClick={handleDistributeHorizontally}>
              <FormatAlignCenter />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('floatingToolbar.arrange.distributeVertical') || 'Distribute Vertically'}>
            <IconButton size="small" onClick={handleDistributeVertically}>
              <VerticalAlignCenter />
            </IconButton>
          </Tooltip>
        </>
      )}
      {items.length === 1 && (
        <>
          <Tooltip title={t('floatingToolbar.arrange.bringToFront') || 'Bring to Front'}>
            <IconButton size="small" onClick={handleBringToFront}>
              <VerticalAlignTop />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('floatingToolbar.arrange.sendToBack') || 'Send to Back'}>
            <IconButton size="small" onClick={handleSendToBack}>
              <MoveToInbox />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );
};

