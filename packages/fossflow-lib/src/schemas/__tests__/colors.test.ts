import { colorSchema, colorsSchema } from '../colors';

describe('colorSchema', () => {
  it('validates a correct color', () => {
    const valid = { id: 'color1', value: '#123456' };
    expect(colorSchema.safeParse(valid).success).toBe(true);
  });
  it('fails if value is too long', () => {
    const invalid = { id: 'color1', value: '#1234567A' };
    const result = colorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue: any) => {
          return issue.path.includes('value');
        })
      ).toBe(true);
    }
  });
});

describe('colorsSchema', () => {
  it('validates an array of colors', () => {
    const valid = [
      { id: 'color1', value: '#000000' },
      { id: 'color2', value: '#ffffff' }
    ];
    expect(colorsSchema.safeParse(valid).success).toBe(true);
  });
  it('fails if any color is invalid', () => {
    const invalid = [
      { id: 'color1', value: '#000000' },
      { id: 'color2', value: '#1234567A' }
    ];
    const result = colorsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue: any) => {
          return issue.path.includes('value');
        })
      ).toBe(true);
    }
  });
});
