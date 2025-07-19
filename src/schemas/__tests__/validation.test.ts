import { produce } from 'immer';
import { Connector, ViewItem } from 'src/types';
import { model as modelFixture } from '../../fixtures/model';
import { validateModel } from '../validation';

describe('Model validation works correctly', () => {
  test('Model fixture is valid', () => {
    const issues = validateModel(modelFixture);

    expect(issues.length).toStrictEqual(0);
  });

  test('Connector with anchor that references an invalid item fails validation', () => {
    const invalidConnector: Connector = {
      id: 'invalidConnector',
      color: 'color1',
      anchors: [
        { id: 'testAnch', ref: { item: 'node1' } },
        { id: 'testAnch2', ref: { item: 'invalidItem' } }
      ]
    };

    const model = produce(modelFixture, (draft) => {
      draft.views[0].connectors?.push(invalidConnector);
    });

    const issues = validateModel(model);

    expect(issues[0].type).toStrictEqual('INVALID_ANCHOR_TO_VIEW_ITEM_REF');
  });

  test('Connector with less than two anchors fails validation', () => {
    const invalidConnector: Connector = {
      id: 'invalidConnector',
      color: 'color1',
      anchors: []
    };

    const model = produce(modelFixture, (draft) => {
      draft.views[0].connectors?.push(invalidConnector);
    });

    const issues = validateModel(model);

    expect(issues[0].type).toStrictEqual('CONNECTOR_TOO_FEW_ANCHORS');
  });

  test('Connector with anchor that references an invalid anchor fails validation', () => {
    const invalidConnector: Connector = {
      id: 'invalidConnector',
      color: 'color1',
      anchors: [
        { id: 'testAnch1', ref: { anchor: 'invalidAnchor' } },
        { id: 'testAnch2', ref: { anchor: 'anchor1' } }
      ]
    };

    const model = produce(modelFixture, (draft) => {
      draft.views[0].connectors?.push(invalidConnector);
    });

    const issues = validateModel(model);

    expect(issues[0].type).toStrictEqual('INVALID_ANCHOR_TO_ANCHOR_REF');
  });

  test('An invalid view item fails validation', () => {
    const invalidItem: ViewItem = {
      id: 'invalidItem',
      tile: {
        x: 0,
        y: 0
      }
    };

    const model = produce(modelFixture, (draft) => {
      draft.views[0].items.push(invalidItem);
    });

    const issues = validateModel(model);

    expect(issues[0].type).toStrictEqual('INVALID_VIEW_ITEM_TO_MODEL_ITEM_REF');
  });

  test('A connector with an invalid color fails validation', () => {
    const invalidConnector: Connector = {
      id: 'invalidConnector',
      color: 'invalidColor',
      anchors: []
    };

    const model = produce(modelFixture, (draft) => {
      draft.views[0].connectors?.push(invalidConnector);
    });

    const issues = validateModel(model);

    expect(issues[0].type).toStrictEqual('INVALID_CONNECTOR_COLOR_REF');
  });

  test('A rectangle with an invalid color fails validation', () => {
    const invalidRectangle = {
      id: 'invalidRectangle',
      color: 'invalidColor',
      from: { x: 0, y: 0 },
      to: { x: 2, y: 2 }
    };

    const model = produce(modelFixture, (draft) => {
      draft.views[0].rectangles?.push(invalidRectangle);
    });

    const issues = validateModel(model);

    expect(issues[0].type).toStrictEqual('INVALID_RECTANGLE_COLOR_REF');
  });
});

describe('modelSchema Zod validation', () => {
  const { model } = require('../../fixtures/model');

  test('Valid model passes modelSchema validation', () => {
    const result = require('../model').modelSchema.safeParse(model);
    expect(result.success).toBe(true);
  });

  test('Model missing required title fails modelSchema validation', () => {
    const { ...invalidModel } = model;
    delete invalidModel.title;
    const result = require('../model').modelSchema.safeParse(invalidModel);
    expect(result.success).toBe(false);
    expect(
      result.error.issues.some((issue: any) => {
        return issue.path.includes('title');
      })
    ).toBe(true);
  });

  test('Model with invalid color reference fails modelSchema validation', () => {
    const { ...invalidModel } = model;
    // Add a rectangle with an invalid color to the first view
    invalidModel.views = invalidModel.views.map((view: any, i: number) => {
      return i === 0
        ? {
            ...view,
            rectangles: [
              ...(view.rectangles || []),
              {
                id: 'rect-invalid',
                color: 'notAColor',
                from: { x: 0, y: 0 },
                to: { x: 1, y: 1 }
              }
            ]
          }
        : view;
    });
    const result = require('../model').modelSchema.safeParse(invalidModel);
    expect(result.success).toBe(false);
    if (!result.success) {
      // Print all issues for debugging
      console.log('Zod issues:', result.error.issues);
      expect(
        result.error.issues.some((issue: any) => {
          return (
            issue.message ===
              'Rectangle references a color that does not exist in the model.' &&
            issue.params &&
            issue.params.rectangle === 'rect-invalid'
          );
        })
      ).toBe(true);
    }
  });
});
