import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  FormatAlignLeft,
  FormatAlignRight,
  FormatAlignCenter,
  VerticalAlignTop,
  VerticalAlignBottom,
  VerticalAlignCenter
} from '@mui/icons-material';
import { ItemReference } from 'src/types';
import { useScene } from 'src/hooks/useScene';
import { useTranslation } from 'src/stores/localeStore';
import {
  alignLeft,
  alignRight,
  alignTop,
  alignBottom,
  alignCenterHorizontal,
  alignCenterVertical
} from 'src/utils/alignment';

interface Props {
  items: ItemReference[];
}

export const AlignmentTools = ({ items }: Props) => {
  const scene = useScene();
  const { t } = useTranslation();

  if (items.length < 2) {
    return null;
  }

  const handleAlignLeft = () => {
    alignLeft(items, scene);
  };

  const handleAlignRight = () => {
    alignRight(items, scene);
  };

  const handleAlignTop = () => {
    alignTop(items, scene);
  };

  const handleAlignBottom = () => {
    alignBottom(items, scene);
  };

  const handleAlignCenterHorizontal = () => {
    alignCenterHorizontal(items, scene);
  };

  const handleAlignCenterVertical = () => {
    alignCenterVertical(items, scene);
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
      <Tooltip title={t('floatingToolbar.align.left') || 'Align Left'}>
        <IconButton size="small" onClick={handleAlignLeft}>
          <FormatAlignLeft />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('floatingToolbar.align.right') || 'Align Right'}>
        <IconButton size="small" onClick={handleAlignRight}>
          <FormatAlignRight />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('floatingToolbar.align.centerHorizontal') || 'Center Horizontally'}>
        <IconButton size="small" onClick={handleAlignCenterHorizontal}>
          <FormatAlignCenter />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('floatingToolbar.align.top') || 'Align Top'}>
        <IconButton size="small" onClick={handleAlignTop}>
          <VerticalAlignTop />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('floatingToolbar.align.bottom') || 'Align Bottom'}>
        <IconButton size="small" onClick={handleAlignBottom}>
          <VerticalAlignBottom />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('floatingToolbar.align.centerVertical') || 'Center Vertically'}>
        <IconButton size="small" onClick={handleAlignCenterVertical}>
          <VerticalAlignCenter />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

