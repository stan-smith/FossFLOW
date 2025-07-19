import { rectangleSchema } from '../rectangle';

describe('rectangleSchema', () => {
  it('validates a correct rectangle', () => {
    const valid = { id: 'rect1', from: { x: 0, y: 0 }, to: { x: 1, y: 1 } };
    expect(rectangleSchema.safeParse(valid).success).toBe(true);
  });
  it('fails if from is missing', () => {
    const invalid = { id: 'rect1', to: { x: 1, y: 1 } };
    const result = rectangleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue: any) => {
          return issue.path.includes('from');
        })
      ).toBe(true);
    }
  });
});
