import React, { useMemo } from 'react';
import { Box, Typography, Select, MenuItem, Slider, FormControl, InputLabel } from '@mui/material';
import { connectorStyleOptions, connectorLineTypeOptions } from 'src/schemas/connector';
import { useScene } from 'src/hooks/useScene';
import { useTranslation } from 'src/stores/localeStore';
import { Connector } from 'src/types';

interface Props {
  connectorIds: string[];
}

export const EdgeEditingTools = ({ connectorIds }: Props) => {
  const scene = useScene();
  const { t } = useTranslation();

  const connectors = useMemo(() => {
    return connectorIds
      .map((id) => scene.connectors.find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);
  }, [connectorIds, scene.connectors]);

  if (connectors.length === 0) {
    return null;
  }

  // Get common values for multi-selection
  const commonStyle = useMemo(() => {
    const styles = new Set(connectors.map((c) => c.style || 'SOLID'));
    return styles.size === 1 ? Array.from(styles)[0] : 'SOLID';
  }, [connectors]);

  const commonLineType = useMemo(() => {
    const lineTypes = new Set(connectors.map((c) => c.lineType || 'SINGLE'));
    return lineTypes.size === 1 ? Array.from(lineTypes)[0] : 'SINGLE';
  }, [connectors]);

  const commonWidth = useMemo(() => {
    const widths = connectors.map((c) => c.width || 10);
    const min = Math.min(...widths);
    const max = Math.max(...widths);
    return min === max ? min : min; // Use min if different
  }, [connectors]);

  const handleStyleChange = (style: string) => {
    scene.transaction(() => {
      connectors.forEach((connector) => {
        scene.updateConnector(connector.id, {
          style: style as Connector['style']
        });
      });
    });
  };

  const handleLineTypeChange = (lineType: string) => {
    scene.transaction(() => {
      connectors.forEach((connector) => {
        scene.updateConnector(connector.id, {
          lineType: lineType as Connector['lineType']
        });
      });
    });
  };

  const handleWidthChange = (_event: Event, value: number | number[]) => {
    const width = Array.isArray(value) ? value[0] : value;
    scene.transaction(() => {
      connectors.forEach((connector) => {
        scene.updateConnector(connector.id, { width });
      });
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        px: 1
      }}
    >
      <Typography variant="body2" sx={{ mr: 1 }}>
        {connectors.length} {connectors.length === 1 ? t('floatingToolbar.edge.edge') || 'Edge' : t('floatingToolbar.edge.edges') || 'Edges'}
      </Typography>

      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>{t('floatingToolbar.edge.lineStyle') || 'Line Style'}</InputLabel>
        <Select
          value={commonStyle}
          onChange={(e) => handleStyleChange(e.target.value)}
          label={t('floatingToolbar.edge.lineStyle') || 'Line Style'}
        >
          {connectorStyleOptions.map((style) => (
            <MenuItem key={style} value={style}>
              {style}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>{t('floatingToolbar.edge.lineType') || 'Line Type'}</InputLabel>
        <Select
          value={commonLineType}
          onChange={(e) => handleLineTypeChange(e.target.value)}
          label={t('floatingToolbar.edge.lineType') || 'Line Type'}
        >
          {connectorLineTypeOptions.map((type) => {
            let displayName = 'Double Line with Circle';
            if (type === 'SINGLE') {
              displayName = t('floatingToolbar.edge.single') || 'Single Line';
            } else if (type === 'DOUBLE') {
              displayName = t('floatingToolbar.edge.double') || 'Double Line';
            }
            return (
              <MenuItem key={type} value={type}>
                {displayName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <Box sx={{ width: 100, px: 1 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          {t('floatingToolbar.edge.width') || 'Width'}
        </Typography>
        <Slider
          value={commonWidth}
          onChange={handleWidthChange}
          min={10}
          max={30}
          step={1}
          size="small"
        />
      </Box>
    </Box>
  );
};

