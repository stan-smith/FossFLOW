import { Coords } from '../types';
export declare class CoordsUtils {
    static isEqual(base: Coords, operand: Coords): boolean;
    static subtract(base: Coords, operand: Coords): Coords;
    static add(base: Coords, operand: Coords): Coords;
    static multiply(base: Coords, operand: number): Coords;
    static toString(coords: Coords): string;
    static sum(coords: Coords): number;
    static zero(): {
        x: number;
        y: number;
    };
}
