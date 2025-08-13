// import { CoordsUtils, isWithinBounds } from 'src/utils';
// import { ModeActions } from 'src/types';

// export const Lasso: ModeActions = {
//   type: 'LASSO',
//   mousemove: ({ uiState, Model }) => {
//     if (uiState.mode.type !== 'LASSO') return;

//     if (uiState.mouse.mousedown === null) return;
//     // User is in mousedown mode

//     if (
//       uiState.mouse.delta === null ||
//       CoordsUtils.isEqual(uiState.mouse.delta.tile, CoordsUtils.zero())
//     )
//       return;
//     // User has moved tile since they moused down

//     if (!uiState.mode.isDragging) {
//       const { mousedown } = uiState.mouse;
//       const items = Model.nodes.filter((node) => {
//         return CoordsUtils.isEqual(node.tile, mousedown.tile);
//       });

//       // User is creating a selection
//       uiState.mode.selection = {
//         startTile: uiState.mouse.mousedown.tile,
//         endTile: uiState.mouse.position.tile,
//         items
//       };

//       return;
//     }

//     if (uiState.mode.isDragging) {
//       // User is dragging an existing selection
//       uiState.mode.selection.startTile = CoordsUtils.add(
//         uiState.mode.selection.startTile,
//         uiState.mouse.delta.tile
//       );
//       uiState.mode.selection.endTile = CoordsUtils.add(
//         uiState.mode.selection.endTile,
//         uiState.mouse.delta.tile
//       );
//     }
//   },
//   mousedown: (draft) => {
//     if (draft.mode.type !== 'LASSO') return;

//     if (draft.mode.selection) {
//       const isWithinSelection = isWithinBounds(draft.mouse.position.tile, [
//         draft.mode.selection.startTile,
//         draft.mode.selection.endTile
//       ]);

//       if (!isWithinSelection) {
//         draft.mode = {
//           type: 'CURSOR',
//           showCursor: true,
//           mousedown: null
//         };

//         return;
//       }

//       if (isWithinSelection) {
//         draft.mode.isDragging = true;

//         return;
//       }
//     }

//     draft.mode = {
//       type: 'CURSOR',
//       showCursor: true,
//       mousedown: null
//     };
//   }
// };
