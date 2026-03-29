import React, { useMemo, memo } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import {
  PROJECTED_TILE_SIZE,
  DEFAULT_LABEL_HEIGHT,
  MARKDOWN_EMPTY_VALUE
} from 'src/config';
import { getTilePosition } from 'src/utils';
import { useIcon } from 'src/hooks/useIcon';
import { ViewItem } from 'src/types';
import { useModelItem } from 'src/hooks/useModelItem';
import { ExpandableLabel } from 'src/components/Label/ExpandableLabel';
import { RichTextEditor } from 'src/components/RichTextEditor/RichTextEditor';

interface Props {
  node: ViewItem;
  order: number;
}

export const Node = memo(({ node, order }: Props) => {
  const modelItem = useModelItem(node.id);
  const { iconComponent } = useIcon(modelItem?.icon);

  const position = useMemo(() => {
    return getTilePosition({
      tile: node.tile,
      origin: 'BOTTOM'
    });
  }, [node.tile]);

  const description = useMemo(() => {
    if (
      !modelItem ||
      modelItem.description === undefined ||
      modelItem.description === MARKDOWN_EMPTY_VALUE
    )
      return null;

    return modelItem.description;
  }, [modelItem?.description]);

  // If modelItem doesn't exist, don't render the node
  if (!modelItem) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: order
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          left: position.x,
          top: position.y - (PROJECTED_TILE_SIZE.height / 2),
          transition: 'transform 0.3s ease, filter 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
          },
        }}
      >
        {(modelItem?.name || description || modelItem?.ipAddress || modelItem?.hostname || modelItem?.os) && (
          <Box>
            <ExpandableLabel
              maxWidth={250}
              expandDirection="BOTTOM"
              labelHeight={node.labelHeight ?? DEFAULT_LABEL_HEIGHT}
            >
              <Stack spacing={1}>
                {modelItem.name && (
                  <Typography fontWeight={600}>{modelItem.name}</Typography>
                )}
                {modelItem.ipAddress && (
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 'bold' }}>
                    IP: {modelItem.ipAddress}
                  </Typography>
                )}
                {modelItem.hostname && (
                  <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    Host: {modelItem.hostname}
                  </Typography>
                )}
                {modelItem.os && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    OS: {modelItem.os}
                  </Typography>
                )}
                {modelItem.description &&
                  modelItem.description !== MARKDOWN_EMPTY_VALUE && (
                    <RichTextEditor value={modelItem.description} readOnly />
                  )}
              </Stack>
            </ExpandableLabel>
          </Box>
        )}
        {iconComponent && (
          <Box
            sx={{
              pointerEvents: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              animation: 'nodeFloat 4s ease-in-out infinite',
              '@keyframes nodeFloat': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-3px)' },
              },
            }}
          >
            {iconComponent}
          </Box>
        )}
      </Box>
    </Box>
  );
});
