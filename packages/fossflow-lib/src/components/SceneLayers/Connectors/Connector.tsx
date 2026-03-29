import React, { useMemo, memo, useId } from 'react';
import { useTheme, Box } from '@mui/material';
import { UNPROJECTED_TILE_SIZE } from 'src/config';
import {
  getAnchorTile,
  getColorVariant,
  getConnectorDirectionIcon
} from 'src/utils';
import { Circle } from 'src/components/Circle/Circle';
import { Svg } from 'src/components/Svg/Svg';
import { useIsoProjection } from 'src/hooks/useIsoProjection';
import { useConnector } from 'src/hooks/useConnector';
import { useScene } from 'src/hooks/useScene';
import { useColor } from 'src/hooks/useColor';

interface Props {
  connector: ReturnType<typeof useScene>['connectors'][0];
  isSelected?: boolean;
}

export const Connector = memo(({ connector: _connector, isSelected }: Props) => {
  const theme = useTheme();
  const predefinedColor = useColor(_connector.color);
  const { currentView } = useScene();
  const connector = useConnector(_connector.id);
  const uniqueId = useId();

  if (!connector) {
    return null;
  }

  // Use custom color if provided, otherwise use predefined color
  const color = connector.customColor 
    ? { value: connector.customColor }
    : predefinedColor;
    
  if (!color) {
    return null;
  }

  const { css, pxSize } = useIsoProjection({
    ...connector.path.rectangle
  });

  const drawOffset = useMemo(() => {
    return {
      x: UNPROJECTED_TILE_SIZE / 2,
      y: UNPROJECTED_TILE_SIZE / 2
    };
  }, []);

  const connectorWidthPx = useMemo(() => {
    return (UNPROJECTED_TILE_SIZE / 100) * connector.width;
  }, [connector.width]);

  const pathString = useMemo(() => {
    return connector.path.tiles.reduce((acc, tile) => {
      return `${acc} ${tile.x * UNPROJECTED_TILE_SIZE + drawOffset.x},${
        tile.y * UNPROJECTED_TILE_SIZE + drawOffset.y
      }`;
    }, '');
  }, [connector.path.tiles, drawOffset]);

  // Create offset paths for double lines
  const offsetPaths = useMemo(() => {
    if (!connector.lineType || connector.lineType === 'SINGLE') return null;
    
    const tiles = connector.path.tiles;
    if (tiles.length < 2) return null;
    
    const offset = connectorWidthPx * 3; // Larger spacing between double lines for visibility
    const path1Points: string[] = [];
    const path2Points: string[] = [];
    
    for (let i = 0; i < tiles.length; i++) {
      const curr = tiles[i];
      let dx = 0, dy = 0;
      
      // Calculate perpendicular offset based on line direction
      if (i > 0 && i < tiles.length - 1) {
        const prev = tiles[i - 1];
        const next = tiles[i + 1];
        const dx1 = curr.x - prev.x;
        const dy1 = curr.y - prev.y;
        const dx2 = next.x - curr.x;
        const dy2 = next.y - curr.y;
        
        // Average direction for smooth corners
        const avgDx = (dx1 + dx2) / 2;
        const avgDy = (dy1 + dy2) / 2;
        const len = Math.sqrt(avgDx * avgDx + avgDy * avgDy) || 1;
        
        // Perpendicular vector
        dx = -avgDy / len;
        dy = avgDx / len;
      } else if (i === 0 && tiles.length > 1) {
        // Start point
        const next = tiles[1];
        const dirX = next.x - curr.x;
        const dirY = next.y - curr.y;
        const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        dx = -dirY / len;
        dy = dirX / len;
      } else if (i === tiles.length - 1 && tiles.length > 1) {
        // End point
        const prev = tiles[i - 1];
        const dirX = curr.x - prev.x;
        const dirY = curr.y - prev.y;
        const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        dx = -dirY / len;
        dy = dirX / len;
      }
      
      const x = curr.x * UNPROJECTED_TILE_SIZE + drawOffset.x;
      const y = curr.y * UNPROJECTED_TILE_SIZE + drawOffset.y;
      
      path1Points.push(`${x + dx * offset},${y + dy * offset}`);
      path2Points.push(`${x - dx * offset},${y - dy * offset}`);
    }
    
    return {
      path1: path1Points.join(' '),
      path2: path2Points.join(' ')
    };
  }, [connector.path.tiles, connector.lineType, connectorWidthPx, drawOffset]);

  const anchorPositions = useMemo(() => {
    if (!isSelected) return [];

    return connector.anchors.map((anchor) => {
      const position = getAnchorTile(anchor, currentView);

      return {
        id: anchor.id,
        x:
          (connector.path.rectangle.from.x - position.x) *
            UNPROJECTED_TILE_SIZE +
          drawOffset.x,
        y:
          (connector.path.rectangle.from.y - position.y) *
            UNPROJECTED_TILE_SIZE +
          drawOffset.y
      };
    });
  }, [
    currentView,
    connector.path.rectangle,
    connector.anchors,
    drawOffset,
    isSelected
  ]);

  const directionIcon = useMemo(() => {
    return getConnectorDirectionIcon(connector.path.tiles);
  }, [connector.path.tiles]);

  const strokeDashArray = useMemo(() => {
    switch (connector.style) {
      case 'DASHED':
        return `${connectorWidthPx * 2}, ${connectorWidthPx * 2}`;
      case 'DOTTED':
        return `0, ${connectorWidthPx * 1.8}`;
      case 'SOLID':
      default:
        return 'none';
    }
  }, [connector.style, connectorWidthPx]);

  const lineType = connector.lineType || 'SINGLE';

  // Flow animation parameters
  const flowDashSize = connectorWidthPx * 3;
  const flowGapSize = connectorWidthPx * 6;
  const flowAnimationName = `flow-${uniqueId.replace(/:/g, '')}`;
  const glowAnimationName = `glow-${uniqueId.replace(/:/g, '')}`;
  const arrowPulseAnimationName = `arrow-pulse-${uniqueId.replace(/:/g, '')}`;

  const connectorColor = getColorVariant(color.value, 'dark', { grade: 1 });

  return (
    <Box style={css}>
      <Svg
        style={{
          // TODO: The original x coordinates of each tile seems to be calculated wrongly.
          // They are mirrored along the x-axis.  The hack below fixes this, but we should
          // try to fix this issue at the root of the problem (might have further implications).
          transform: 'scale(-1, 1)'
        }}
        viewboxSize={pxSize}
      >
        <defs>
          {/* Flow animation keyframes */}
          <style>{`
            @keyframes ${flowAnimationName} {
              from { stroke-dashoffset: ${flowDashSize + flowGapSize}; }
              to { stroke-dashoffset: 0; }
            }
            @keyframes ${glowAnimationName} {
              0%, 100% { filter: drop-shadow(0 0 ${connectorWidthPx * 0.5}px ${connectorColor}40); }
              50% { filter: drop-shadow(0 0 ${connectorWidthPx * 1.5}px ${connectorColor}80); }
            }
            @keyframes ${arrowPulseAnimationName} {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.15); opacity: 0.85; }
            }
          `}</style>
          {/* Glow filter */}
          <filter id={`glow-filter-${uniqueId.replace(/:/g, '')}`}>
            <feGaussianBlur stdDeviation={connectorWidthPx * 0.4} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated flow overlay group */}
        <g style={{ animation: `${glowAnimationName} 3s ease-in-out infinite` }}>
          {lineType === 'SINGLE' ? (
            <>
              {/* Base white shadow line */}
              <polyline
                points={pathString}
                stroke={theme.palette.common.white}
                strokeWidth={connectorWidthPx * 1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={0.7}
                strokeDasharray={strokeDashArray}
                fill="none"
              />
              {/* Main connector line */}
              <polyline
                points={pathString}
                stroke={connectorColor}
                strokeWidth={connectorWidthPx}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={strokeDashArray}
                fill="none"
              />
              {/* Animated flow particles overlay */}
              <polyline
                points={pathString}
                stroke={theme.palette.common.white}
                strokeWidth={connectorWidthPx * 0.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={0.6}
                strokeDasharray={`${flowDashSize}, ${flowGapSize}`}
                fill="none"
                style={{
                  animation: `${flowAnimationName} 1.5s linear infinite`
                }}
              />
            </>
          ) : offsetPaths ? (
            <>
              {/* First line of double */}
              <polyline
                points={offsetPaths.path1}
                stroke={theme.palette.common.white}
                strokeWidth={connectorWidthPx * 1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={0.7}
                strokeDasharray={strokeDashArray}
                fill="none"
              />
              <polyline
                points={offsetPaths.path1}
                stroke={connectorColor}
                strokeWidth={connectorWidthPx}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={strokeDashArray}
                fill="none"
              />
              {/* Flow particles on first line */}
              <polyline
                points={offsetPaths.path1}
                stroke={theme.palette.common.white}
                strokeWidth={connectorWidthPx * 0.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={0.6}
                strokeDasharray={`${flowDashSize}, ${flowGapSize}`}
                fill="none"
                style={{
                  animation: `${flowAnimationName} 1.5s linear infinite`
                }}
              />
              {/* Second line of double */}
              <polyline
                points={offsetPaths.path2}
                stroke={theme.palette.common.white}
                strokeWidth={connectorWidthPx * 1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={0.7}
                strokeDasharray={strokeDashArray}
                fill="none"
              />
              <polyline
                points={offsetPaths.path2}
                stroke={connectorColor}
                strokeWidth={connectorWidthPx}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={strokeDashArray}
                fill="none"
              />
              {/* Flow particles on second line (reverse direction) */}
              <polyline
                points={offsetPaths.path2}
                stroke={theme.palette.common.white}
                strokeWidth={connectorWidthPx * 0.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity={0.6}
                strokeDasharray={`${flowDashSize}, ${flowGapSize}`}
                fill="none"
                style={{
                  animation: `${flowAnimationName} 1.5s linear infinite reverse`
                }}
              />
            </>
          ) : null}
        </g>

        {/* Circle for port-channel representation */}
        {lineType === 'DOUBLE_WITH_CIRCLE' && connector.path.tiles.length >= 2 && (() => {
          const midIndex = Math.floor(connector.path.tiles.length / 2);
          const midTile = connector.path.tiles[midIndex];
          const x = midTile.x * UNPROJECTED_TILE_SIZE + drawOffset.x;
          const y = midTile.y * UNPROJECTED_TILE_SIZE + drawOffset.y;

          // Calculate rotation based on line direction at middle point
          let rotation = 0;
          if (midIndex > 0 && midIndex < connector.path.tiles.length - 1) {
            const prevTile = connector.path.tiles[midIndex - 1];
            const nextTile = connector.path.tiles[midIndex + 1];
            const dx = nextTile.x - prevTile.x;
            const dy = nextTile.y - prevTile.y;
            rotation = Math.atan2(dy, dx) * (180 / Math.PI);
          }

          // Increased size to encompass both lines with the spacing
          const circleRadiusX = connectorWidthPx * 5;
          const circleRadiusY = connectorWidthPx * 4;

          return (
            <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
              <ellipse
                cx={0}
                cy={0}
                rx={circleRadiusX}
                ry={circleRadiusY}
                fill="none"
                stroke={connectorColor}
                strokeWidth={connectorWidthPx * 0.8}
              >
                <animate
                  attributeName="rx"
                  values={`${circleRadiusX};${circleRadiusX * 1.05};${circleRadiusX}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="ry"
                  values={`${circleRadiusY};${circleRadiusY * 1.05};${circleRadiusY}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
              </ellipse>
              <ellipse
                cx={0}
                cy={0}
                rx={circleRadiusX}
                ry={circleRadiusY}
                fill="none"
                stroke={theme.palette.common.white}
                strokeWidth={connectorWidthPx * 1.2}
                strokeOpacity={0.5}
              />
            </g>
          );
        })()}

        {anchorPositions.map((anchor) => {
          return (
            <g key={anchor.id}>
              <Circle
                tile={anchor}
                radius={18}
                fill={theme.palette.background.paper}
                fillOpacity={0.7}
              />
              <Circle
                tile={anchor}
                radius={12}
                stroke={theme.palette.text.primary}
                fill={theme.palette.background.paper}
                strokeWidth={6}
              />
            </g>
          );
        })}

        {directionIcon && connector.showArrow !== false && (
          <g transform={`translate(${directionIcon.x}, ${directionIcon.y})`}>
            <g
              transform={`rotate(${directionIcon.rotation})`}
              style={{
                transformOrigin: '0 0',
                animation: `${arrowPulseAnimationName} 2s ease-in-out infinite`
              }}
            >
              {/* Arrow glow shadow */}
              <polygon
                fill={connectorColor}
                fillOpacity={0.3}
                points="20,19 0,-19 -20,19"
              >
                <animate
                  attributeName="fill-opacity"
                  values="0.1;0.4;0.1"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </polygon>
              {/* Main arrow */}
              <polygon
                fill={theme.palette.text.primary}
                stroke={theme.palette.background.paper}
                strokeWidth={4}
                points="17.58,17.01 0,-17.01 -17.58,17.01"
              />
            </g>
          </g>
        )}
      </Svg>
    </Box>
  );
});
