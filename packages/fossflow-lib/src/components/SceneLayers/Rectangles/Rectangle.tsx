import React from 'react';
import { useScene } from 'src/hooks/useScene';
import { IsoTileArea } from 'src/components/IsoTileArea/IsoTileArea';
import { getColorVariant } from 'src/utils';
import { useColor } from 'src/hooks/useColor';

type Props = ReturnType<typeof useScene>['rectangles'][0];

export const Rectangle = ({ from, to, color: colorId, customColor }: Props) => {
  const predefinedColor = useColor(colorId);
  
  // Use custom color if provided, otherwise use predefined color
  const color = customColor 
    ? { value: customColor }
    : predefinedColor;

  if (!color) {
    return null;
  }

  return (
    <IsoTileArea
      from={from}
      to={to}
      fill={color.value}
      cornerRadius={22}
      stroke={{
        color: getColorVariant(color.value, 'dark', { grade: 2 }),
        width: 1
      }}
    />
  );
};
