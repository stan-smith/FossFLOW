import { useMemo } from 'react';
import { TextBox } from 'src/types';
import {
  UNPROJECTED_TILE_SIZE,
  DEFAULT_FONT_FAMILY,
  TEXTBOX_DEFAULTS,
  TEXTBOX_FONT_WEIGHT,
  TEXTBOX_PADDING
} from 'src/config';

export const useTextBoxProps = (textBox: TextBox) => {
  const fontProps = useMemo(() => {
    return {
      fontSize:
        UNPROJECTED_TILE_SIZE * (textBox.fontSize ?? TEXTBOX_DEFAULTS.fontSize),
      fontFamily: DEFAULT_FONT_FAMILY,
      fontWeight: TEXTBOX_FONT_WEIGHT
    };
  }, [textBox.fontSize]);

  const paddingX = useMemo(() => {
    return UNPROJECTED_TILE_SIZE * TEXTBOX_PADDING;
  }, []);

  return { paddingX, fontProps };
};
