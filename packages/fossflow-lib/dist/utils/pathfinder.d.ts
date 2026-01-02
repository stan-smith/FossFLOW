import { Size, Coords } from '../types';
interface Args {
    gridSize: Size;
    from: Coords;
    to: Coords;
}
export declare const findPath: ({ gridSize, from, to }: Args) => Coords[];
export {};
