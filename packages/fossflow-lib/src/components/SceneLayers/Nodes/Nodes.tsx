import React from 'react';
import { ViewItem } from 'src/types';
import { Node } from './Node/Node';

interface Props {
  nodes: ViewItem[];
}

export const Nodes = ({ nodes }: Props) => {
  return (
    <>
      {[...nodes].reverse().map((node) => {
        return (
          <Node key={node.id} order={-node.tile.x - node.tile.y} node={node} />
        );
      })}
    </>
  );
};
