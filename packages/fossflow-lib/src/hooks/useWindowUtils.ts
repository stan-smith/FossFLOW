import { useEffect } from 'react';
import { useDiagramUtils } from 'src/hooks/useDiagramUtils';

export const useWindowUtils = () => {
  const { fitToView, getUnprojectedBounds } = useDiagramUtils();

  useEffect(() => {
    window.Isoflow = {
      getUnprojectedBounds,
      fitToView
    };
  }, [getUnprojectedBounds, fitToView]);
};
