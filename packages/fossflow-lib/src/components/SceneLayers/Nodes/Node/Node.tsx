import React, { useMemo } from 'react';
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
import { MarkdownEditor } from 'src/components/MarkdownEditor/MarkdownEditor';

interface Props {
  node: ViewItem;
  order: number;
}

export const Node = ({ node, order }: Props) => {
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
        sx={{ position: 'absolute' }}
        style={{
          left: position.x,
          top: position.y
        }}
      >
        {(modelItem?.name || description) && (
          <Box
            sx={{ position: 'absolute' }}
            style={{ bottom: PROJECTED_TILE_SIZE.height / 2 }}
          >
            <ExpandableLabel
              maxWidth={250}
              expandDirection="BOTTOM"
              labelHeight={node.labelHeight ?? DEFAULT_LABEL_HEIGHT}
            >
              <Stack spacing={1}>
                {modelItem.name && (
                  <Typography fontWeight={600}>{modelItem.name}</Typography>
                )}
                {modelItem.description &&
                  modelItem.description !== MARKDOWN_EMPTY_VALUE && (
                    <MarkdownEditor value={modelItem.description} readOnly />
                  )}
              </Stack>
            </ExpandableLabel>
          </Box>
        )}
        {iconComponent && (
          <Box
            sx={{
              position: 'absolute',
              pointerEvents: 'none'
            }}
          >
            {iconComponent}
          </Box>
        )}
      </Box>
    </Box>
  );
};
