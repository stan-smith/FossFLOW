import { iconSchema, iconsSchema } from '../icons';

describe('iconSchema', () => {
  it('validates a correct icon', () => {
    const valid = { id: 'icon1', name: 'Icon', url: 'http://test.com' };
    expect(iconSchema.safeParse(valid).success).toBe(true);
  });

  it('validates an icon with icon_id and no url', () => {
    const valid = { id: 'icon1', name: 'Icon', icon_id: 'isoflow_block' };
    expect(iconSchema.safeParse(valid).success).toBe(true);
  });

  it('fails when both url and icon_id are missing', () => {
    const invalid = { id: 'icon1', name: 'Icon' };
    const result = iconSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('fails if required fields are missing', () => {
    const invalid = { name: 'Icon' };
    const result = iconSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue: any) => {
          return issue.path.includes('id');
        })
      ).toBe(true);
    }
  });
});

describe('iconsSchema', () => {
  it('validates an array of icons', () => {
    const valid = [
      { id: 'icon1', name: 'Icon', url: 'http://test.com' },
      { id: 'icon2', name: 'Icon2', url: 'http://test2.com' }
    ];
    expect(iconsSchema.safeParse(valid).success).toBe(true);
  });
  it('fails if any icon is invalid', () => {
    const invalid = [
      { id: 'icon1', name: 'Icon', url: 'http://test.com' },
      { name: 'MissingId' }
    ];
    const result = iconsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue: any) => {
          return issue.path.includes('id');
        })
      ).toBe(true);
    }
  });
});
