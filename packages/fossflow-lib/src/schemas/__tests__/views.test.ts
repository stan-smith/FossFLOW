import { viewItemSchema, viewSchema, viewsSchema } from '../views';

describe('viewItemSchema', () => {
  it('validates a correct view item', () => {
    const valid = { id: 'item1', tile: { x: 1, y: 2 } };
    expect(viewItemSchema.safeParse(valid).success).toBe(true);
  });
  it('fails if required fields are missing', () => {
    const invalid = { tile: { x: 1, y: 2 } };
    const result = viewItemSchema.safeParse(invalid);
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

describe('viewSchema', () => {
  it('validates a correct view', () => {
    const valid = {
      id: 'view1',
      name: 'View',
      items: [{ id: 'item1', tile: { x: 0, y: 0 } }]
    };
    expect(viewSchema.safeParse(valid).success).toBe(true);
  });
  it('fails if items is missing', () => {
    const invalid = { id: 'view1', name: 'View' };
    const result = viewSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue: any) => {
          return issue.path.includes('items');
        })
      ).toBe(true);
    }
  });
});

describe('viewsSchema', () => {
  it('validates an array of views', () => {
    const valid = [
      {
        id: 'view1',
        name: 'View',
        items: [{ id: 'item1', tile: { x: 0, y: 0 } }]
      }
    ];
    expect(viewsSchema.safeParse(valid).success).toBe(true);
  });
  it('fails if any view is invalid', () => {
    const invalid = [
      {
        id: 'view1',
        name: 'View',
        items: [{ id: 'item1', tile: { x: 0, y: 0 } }]
      },
      { id: 'view2', name: 'View2' }
    ];
    const result = viewsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue: any) => {
          return issue.path.includes('items');
        })
      ).toBe(true);
    }
  });
});
