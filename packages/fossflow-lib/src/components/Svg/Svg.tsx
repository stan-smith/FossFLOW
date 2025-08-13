import React, { useMemo } from 'react';
import { Size } from 'src/types';

type Props = React.SVGProps<SVGSVGElement> & {
  children: React.ReactNode;
  style?: React.CSSProperties;
  viewboxSize?: Size;
};

export const Svg = ({ children, style, viewboxSize, ...rest }: Props) => {
  const dimensionProps = useMemo(() => {
    if (!viewboxSize) return {};

    return {
      viewBox: `0 0 ${viewboxSize.width} ${viewboxSize.height}`,
      width: `${viewboxSize.width}px`,
      height: `${viewboxSize.height}px`
    };
  }, [viewboxSize]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      {...dimensionProps}
      {...rest}
    >
      {children}
    </svg>
  );
};
