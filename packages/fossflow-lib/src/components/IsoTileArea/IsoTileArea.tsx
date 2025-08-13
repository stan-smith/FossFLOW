import React, { useMemo } from 'react';
import { Coords } from 'src/types';
import { Svg } from 'src/components/Svg/Svg';
import { useIsoProjection } from 'src/hooks/useIsoProjection';

interface Props {
  from: Coords;
  to: Coords;
  origin?: Coords;
  fill?: string;
  cornerRadius?: number;
  stroke?: {
    width: number;
    color: string;
  };
}

export const IsoTileArea = ({
  from,
  to,
  fill = 'none',
  cornerRadius = 0,
  stroke
}: Props) => {
  const { css, pxSize } = useIsoProjection({
    from,
    to
  });

  const strokeParams = useMemo(() => {
    if (!stroke) return {};

    return {
      stroke: stroke.color,
      strokeWidth: stroke.width
    };
  }, [stroke]);

  return (
    <Svg viewboxSize={pxSize} style={css}>
      <rect
        width={pxSize.width}
        height={pxSize.height}
        fill={fill}
        rx={cornerRadius}
        {...strokeParams}
      />
    </Svg>
  );
};
