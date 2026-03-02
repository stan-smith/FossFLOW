import { INITIAL_DATA } from 'src/config';
import {
  createIconId,
  parseIconId,
  serializeModelWithoutImages,
  hydrateIconsFromIconIds
} from '../iconIdSerialization';

describe('iconIdSerialization', () => {
  it('creates and parses icon_id values', () => {
    const iconId = createIconId('isoflow', 'block');

    expect(iconId).toBe('isoflow_block');
    expect(parseIconId(iconId)).toEqual({ collection: 'isoflow', iconId: 'block' });
    expect(parseIconId('invalid')).toBeNull();
  });

  it('serializes supported icons without url and with icon_id', () => {
    const model = {
      ...INITIAL_DATA,
      icons: [
        {
          id: 'block',
          name: 'Block',
          collection: 'isoflow',
          url: 'data:image/svg+xml;base64,ABC'
        }
      ]
    };

    const result = serializeModelWithoutImages(model);
    const serializedIcon = result.data.icons[0] as Record<string, any>;

    expect(result.unsupportedIcons).toEqual([]);
    expect(serializedIcon.icon_id).toBe('isoflow_block');
    expect(serializedIcon.url).toBeUndefined();
  });

  it('reports unsupported icons and leaves them unchanged', () => {
    const model = {
      ...INITIAL_DATA,
      icons: [
        {
          id: 'custom',
          name: 'Custom',
          collection: 'imported',
          url: 'data:image/svg+xml;base64,XYZ'
        }
      ]
    };

    const result = serializeModelWithoutImages(model);

    expect(result.unsupportedIcons).toEqual(['custom']);
    expect(result.data.icons[0]).toEqual(model.icons[0]);
  });

  it('hydrates icon_id back into url for supported collections', async () => {
    const hydrated = await hydrateIconsFromIconIds([
      {
        id: 'block',
        name: 'Block',
        collection: 'isoflow',
        icon_id: 'isoflow_block'
      }
    ]);

    const hydratedIcon = hydrated[0] as Record<string, any>;

    expect(hydratedIcon.icon_id).toBeUndefined();
    expect(hydratedIcon.collection).toBe('isoflow');
    expect(hydratedIcon.id).toBe('block');
    expect(typeof hydratedIcon.url).toBe('string');
    expect(hydratedIcon.url.length).toBeGreaterThan(0);
  });
});
