import { Coords } from 'src/types';

export class CoordsUtils {
  static isEqual(base: Coords, operand: Coords) {
    return base.x === operand.x && base.y === operand.y;
  }

  static subtract(base: Coords, operand: Coords): Coords {
    return { x: base.x - operand.x, y: base.y - operand.y };
  }

  static add(base: Coords, operand: Coords): Coords {
    return { x: base.x + operand.x, y: base.y + operand.y };
  }

  static multiply(base: Coords, operand: number): Coords {
    return { x: base.x * operand, y: base.y * operand };
  }

  static toString(coords: Coords) {
    return `x: ${coords.x}, y: ${coords.y}`;
  }

  static sum(coords: Coords) {
    return coords.x + coords.y;
  }

  static zero() {
    return { x: 0, y: 0 };
  }
}
