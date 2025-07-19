import { textBoxSchema } from '../textBox';

describe('textBoxSchema', () => {
  it('validates a correct text box', () => {
    const valid = { id: 'tb1', tile: { x: 0, y: 0 }, content: 'Text' };
    expect(textBoxSchema.safeParse(valid).success).toBe(true);
  });
  it('fails if content is missing', () => {
    const invalid = { id: 'tb1', tile: { x: 0, y: 0 } };
    const result = textBoxSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue: any) => {
          return issue.path.includes('content');
        })
      ).toBe(true);
    }
  });
});
