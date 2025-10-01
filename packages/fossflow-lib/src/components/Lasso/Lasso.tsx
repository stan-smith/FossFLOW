import React from 'react';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { IsoTileArea } from 'src/components/IsoTileArea/IsoTileArea';

export const Lasso = () => {
  const mode = useUiStateStore((state) => {
    return state.mode;
  });

  if (mode.type !== 'LASSO' || !mode.selection) {
    return null;
  }

  const { startTile, endTile } = mode.selection;

  return (
    <IsoTileArea
      from={startTile}
      to={endTile}
      fill="rgba(33, 150, 243, 0.15)"
      cornerRadius={8}
      stroke={{
        color: '#2196f3',
        width: 2,
        dashArray: '8 4'
      }}
    />
  );
};
