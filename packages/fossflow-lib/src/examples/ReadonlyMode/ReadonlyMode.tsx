import React from 'react';
import Isoflow from 'src/Isoflow';
import { initialData } from '../initialData';

export const ReadonlyMode = () => {
  return (
    <Isoflow
      initialData={{ ...initialData, fitToView: true }}
      editorMode="EXPLORABLE_READONLY"
    />
  );
};
