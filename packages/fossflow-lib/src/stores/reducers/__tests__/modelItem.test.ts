import { model as modelFixture } from 'src/fixtures/model';
import { ModelItem } from 'src/types';
import { getItemByIdOrThrow } from 'src/utils';
import {
  createModelItem,
  updateModelItem,
  deleteModelItem
} from '../modelItem';

const scene = {
  connectors: {},
  textBoxes: {}
};

describe('Model item reducers works correctly', () => {
  test('Item is added to model correctly', () => {
    const newItem: ModelItem = {
      id: 'newItem',
      name: 'newItem'
    };

    const newState = createModelItem(newItem, {
      model: modelFixture,
      scene
    });

    expect(newState.model.items[newState.model.items.length - 1]).toStrictEqual(
      newItem
    );
  });

  test('Item is updated correctly', () => {
    const nodeId = 'node1';
    const updates: Partial<ModelItem> = {
      name: 'test'
    };

    const newState = updateModelItem(nodeId, updates, {
      model: modelFixture,
      scene
    });

    const updatedItem = getItemByIdOrThrow(newState.model.items, nodeId);

    expect(updatedItem.value.name).toBe(updates.name);
  });

  test('Item is deleted correctly', () => {
    const nodeId = 'node1';

    const newState = deleteModelItem(nodeId, {
      model: modelFixture,
      scene
    });

    const deletedItem = () => {
      getItemByIdOrThrow(newState.model.items, nodeId);
    };

    expect(deletedItem).toThrow();
  });
});
