import React, { useMemo } from 'react';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { createSmoothPath } from 'src/utils';

export const FreehandLasso = () => {
  const mode = useUiStateStore((state) => {
    return state.mode;
  });

  const rendererSize = useUiStateStore((state) => {
    return state.rendererEl?.getBoundingClientRect();
  });

  const smoothPath = useMemo(() => {
    if (mode.type !== 'FREEHAND_LASSO' || mode.path.length < 2) {
      return '';
    }
    return createSmoothPath(mode.path);
  }, [mode]);

  if (mode.type !== 'FREEHAND_LASSO' || mode.path.length < 2) {
    return null;
  }

  const width = rendererSize?.width || 0;
  const height = rendererSize?.height || 0;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <path
        d={smoothPath}
        fill="rgba(33, 150, 243, 0.15)"
        stroke="#2196f3"
        strokeWidth={2}
        strokeDasharray="8 4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};
