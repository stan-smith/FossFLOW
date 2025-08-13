import React from 'react';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { RectangleTransformControls } from './RectangleTransformControls';
import { TextBoxTransformControls } from './TextBoxTransformControls';
import { NodeTransformControls } from './NodeTransformControls';

export const TransformControlsManager = () => {
  const itemControls = useUiStateStore((state) => {
    return state.itemControls;
  });

  switch (itemControls?.type) {
    case 'ITEM':
      return <NodeTransformControls id={itemControls.id} />;
    case 'RECTANGLE':
      return <RectangleTransformControls id={itemControls.id} />;
    case 'TEXTBOX':
      return <TextBoxTransformControls id={itemControls.id} />;
    default:
      return null;
  }
};
