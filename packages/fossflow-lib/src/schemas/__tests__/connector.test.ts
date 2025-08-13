import { anchorSchema, connectorSchema } from '../connector';

describe('anchorSchema', () => {
  it('validates a correct anchor', () => {
    const valid = { id: 'a1', ref: { item: 'item1' } };
    expect(anchorSchema.safeParse(valid).success).toBe(true);
  });
  it('fails if id is missing', () => {
    const invalid = { ref: { item: 'item1' } };
    const result = anchorSchema.safeParse(invalid);
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

describe('connectorSchema', () => {
  it('validates a correct connector', () => {
    const valid = { id: 'c1', anchors: [{ id: 'a1', ref: { item: 'item1' } }] };
    expect(connectorSchema.safeParse(valid).success).toBe(true);
  });
  it('fails if anchors is missing', () => {
    const invalid = { id: 'c1' };
    const result = connectorSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue: any) => {
          return issue.path.includes('anchors');
        })
      ).toBe(true);
    }
  });
});
