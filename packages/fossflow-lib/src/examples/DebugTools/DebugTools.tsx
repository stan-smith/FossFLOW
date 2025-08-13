import React from 'react';
import Isoflow from 'src/Isoflow';
import { initialData } from '../initialData';

export const DebugTools = () => {
  return (
    <Isoflow
      initialData={{ ...initialData, fitToView: true }}
      enableDebugTools
      height="100%"
    />
  );
};
