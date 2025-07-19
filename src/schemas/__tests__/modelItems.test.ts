import { modelItemSchema, modelItemsSchema } from '../modelItems';

describe('modelItemSchema', () => {
  it('validates a correct model item', () => {
    const valid = {
      id: 'item1',
      name: 'Test',
      icon: 'icon1',
      description: 'desc'
    };
    expect(modelItemSchema.safeParse(valid).success).toBe(true);
  });
  it('fails if required fields are missing', () => {
    const invalid = { name: 'Test' };
    const result = modelItemSchema.safeParse(invalid);
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

describe('modelItemsSchema', () => {
  it('validates an array of model items', () => {
    const valid = [
      { id: 'item1', name: 'Test1' },
      { id: 'item2', name: 'Test2', icon: 'icon2' }
    ];
    expect(modelItemsSchema.safeParse(valid).success).toBe(true);
  });
  it('fails if any item is invalid', () => {
    const invalid = [{ id: 'item1', name: 'Test1' }, { name: 'MissingId' }];
    const result = modelItemsSchema.safeParse(invalid);
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
