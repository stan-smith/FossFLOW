import PF from 'pathfinding';
import { Size, Coords } from 'src/types';

interface Args {
  gridSize: Size;
  from: Coords;
  to: Coords;
}

export const findPath = ({ gridSize, from, to }: Args): Coords[] => {
  const grid = new PF.Grid(gridSize.width, gridSize.height);
  const finder = new PF.AStarFinder({
    heuristic: PF.Heuristic.manhattan,
    diagonalMovement: PF.DiagonalMovement.Always
  });
  const path = finder.findPath(from.x, from.y, to.x, to.y, grid);

  const pathTiles = path.map((tile) => {
    return {
      x: tile[0],
      y: tile[1]
    };
  });

  return pathTiles;
};
