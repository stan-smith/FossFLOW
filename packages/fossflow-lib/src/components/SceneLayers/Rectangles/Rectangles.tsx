import { useMemo, memo } from 'react';
import { useScene } from 'src/hooks/useScene';
import { Rectangle } from './Rectangle';

interface Props {
  rectangles: ReturnType<typeof useScene>['rectangles'];
}

export const Rectangles = memo(({ rectangles }: Props) => {
  const reversedRectangles = useMemo(() => [...rectangles].reverse(), [rectangles]);

  return (
    <>
      {reversedRectangles.map((rectangle) => {
        return <Rectangle key={rectangle.id} {...rectangle} />;
      })}
    </>
  );
});

Rectangles.displayName = 'Rectangles';
