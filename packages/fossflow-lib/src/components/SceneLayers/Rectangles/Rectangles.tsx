import React from 'react';
import { useScene } from 'src/hooks/useScene';
import { Rectangle } from './Rectangle';

interface Props {
  rectangles: ReturnType<typeof useScene>['rectangles'];
}

export const Rectangles = ({ rectangles }: Props) => {
  return (
    <>
      {[...rectangles].reverse().map((rectangle) => {
        return <Rectangle key={rectangle.id} {...rectangle} />;
      })}
    </>
  );
};
