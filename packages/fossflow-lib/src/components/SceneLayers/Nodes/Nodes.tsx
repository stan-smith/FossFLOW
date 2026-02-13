import { useMemo, memo } from 'react';
import { ViewItem } from 'src/types';
import { Node } from './Node/Node';

interface Props {
  nodes: ViewItem[];
}

export const Nodes = memo(({ nodes }: Props) => {
  const reversedNodes = useMemo(() => [...nodes].reverse(), [nodes]);

  return (
    <>
      {reversedNodes.map((node) => {
        return (
          <Node key={node.id} order={-node.tile.x - node.tile.y} node={node} />
        );
      })}
    </>
  );
});

Nodes.displayName = 'Nodes';
