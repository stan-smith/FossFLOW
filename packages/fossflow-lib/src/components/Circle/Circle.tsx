import React from 'react';
import { Coords } from 'src/types';

interface Props {
  tile: Coords;
  radius?: number;
}

export const Circle = ({
  tile,
  radius,
  ...rest
}: Props & React.SVGProps<SVGCircleElement>) => {
  return <circle cx={tile.x} cy={tile.y} r={radius} {...rest} />;
};
