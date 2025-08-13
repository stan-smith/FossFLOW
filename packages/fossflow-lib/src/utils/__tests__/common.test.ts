import { clamp } from '../common';

describe('Tests common utilities', () => {
  test('clamp() works correctly', () => {
    const clampNoChange = clamp(5, 0, 10);
    const clampMin = clamp(5, 6, 10);
    const clampMax = clamp(5, 0, 3);
    const clampDraw1 = clamp(5, 5, 10);
    const clampDraw2 = clamp(5, 0, 5);

    expect(clampNoChange).toBe(5);
    expect(clampMin).toBe(6);
    expect(clampMax).toBe(3);
    expect(clampDraw1).toBe(5);
    expect(clampDraw2).toBe(5);
  });
});
