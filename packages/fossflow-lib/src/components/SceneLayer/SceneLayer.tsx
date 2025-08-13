import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { Box, SxProps } from '@mui/material';
import { useUiStateStore } from 'src/stores/uiStateStore';

interface Props {
  children?: React.ReactNode;
  order?: number;
  sx?: SxProps;
  disableAnimation?: boolean;
}

export const SceneLayer = ({
  children,
  order = 0,
  sx,
  disableAnimation
}: Props) => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const elementRef = useRef<HTMLDivElement>(null);

  const scroll = useUiStateStore((state) => {
    return state.scroll;
  });
  const zoom = useUiStateStore((state) => {
    return state.zoom;
  });

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.to(elementRef.current, {
      duration: disableAnimation || isFirstRender ? 0 : 0.25,
      translateX: scroll.position.x,
      translateY: scroll.position.y,
      scale: zoom
    });

    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, [zoom, scroll, disableAnimation, isFirstRender]);

  return (
    <Box
      ref={elementRef}
      sx={{
        position: 'absolute',
        zIndex: order,
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        userSelect: 'none',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};
