import React, { useMemo, memo } from 'react';
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
    dashArray?: string;
  };
}

export const IsoTileArea = memo(({
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

    const params: Record<string, any> = {
      stroke: stroke.color,
      strokeWidth: stroke.width
    };

    if (stroke.dashArray) {
      params.strokeDasharray = stroke.dashArray;
    }

    return params;
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
});
