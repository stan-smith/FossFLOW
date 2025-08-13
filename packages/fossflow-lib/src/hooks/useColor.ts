import { useMemo } from 'react';
import { getItemById } from 'src/utils';
import { useScene } from 'src/hooks/useScene';

export const useColor = (colorId?: string) => {
  const { colors } = useScene();

  const color = useMemo(() => {
    if (colorId === undefined) {
      return colors.length > 0 ? colors[0] : null;
    }

    const item = getItemById(colors, colorId);
    return item ? item.value : null;
  }, [colorId, colors]);

  return color;
};
