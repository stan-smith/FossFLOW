import { useCallback, useEffect, useRef, useState } from 'react';
import { Size } from 'src/types';

export const useResizeObserver = (el?: HTMLElement | null) => {
  const resizeObserverRef = useRef<ResizeObserver>();
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  const disconnect = useCallback(() => {
    resizeObserverRef.current?.disconnect();
  }, []);

  const observe = useCallback(
    (element: HTMLElement) => {
      disconnect();

      resizeObserverRef.current = new ResizeObserver(() => {
        setSize({
          width: element.clientWidth,
          height: element.clientHeight
        });
      });

      resizeObserverRef.current.observe(element);
    },
    [disconnect]
  );

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  useEffect(() => {
    if (el) observe(el);
  }, [observe, el]);

  return {
    size,
    disconnect,
    observe
  };
};
