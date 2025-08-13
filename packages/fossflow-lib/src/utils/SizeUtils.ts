import { Size } from 'src/types';

export class SizeUtils {
  static isEqual(base: Size, operand: Size) {
    return base.width === operand.width && base.height === operand.height;
  }

  static subtract(base: Size, operand: Size): Size {
    return {
      width: base.width - operand.width,
      height: base.height - operand.height
    };
  }

  static add(base: Size, operand: Size): Size {
    return {
      width: base.width + operand.width,
      height: base.height + operand.height
    };
  }

  static multiply(base: Size, operand: number): Size {
    return { width: base.width * operand, height: base.height * operand };
  }

  static toString(size: Size) {
    return `width: ${size.width}, height: ${size.height}`;
  }

  static zero() {
    return { width: 0, y: 0 };
  }
}
