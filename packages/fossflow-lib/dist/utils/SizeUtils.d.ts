import { Size } from '../types';
export declare class SizeUtils {
    static isEqual(base: Size, operand: Size): boolean;
    static subtract(base: Size, operand: Size): Size;
    static add(base: Size, operand: Size): Size;
    static multiply(base: Size, operand: number): Size;
    static toString(size: Size): string;
    static zero(): {
        width: number;
        y: number;
    };
}
