import { ItemReference } from 'src/types';
import { useScene } from 'src/hooks/useScene';
import { Group, Scene } from 'src/types/scene';
import { generateId } from './common';
import { produce } from 'immer';

/**
 * Create a new group from selected items
 * Returns updated scene state
 */
export const createGroup = (
  itemIds: string[],
  scene: Scene,
  name?: string
): { scene: Scene; groupId: string } | null => {
  if (itemIds.length === 0) {
    return null;
  }

  const groupId = generateId();
  const group: Group = {
    id: groupId,
    name: name || `Group ${groupId.slice(0, 8)}`,
    itemIds: [...itemIds]
  };

  const updatedScene = produce(scene, (draft) => {
    if (!draft.groups) {
      draft.groups = {};
    }
    draft.groups[groupId] = group;
  });

  return { scene: updatedScene, groupId };
};

/**
 * Remove items from group (ungroup)
 * Returns updated scene state
 */
export const ungroupItems = (
  groupId: string,
  scene: Scene
): Scene => {
  const updatedScene = produce(scene, (draft) => {
    if (draft.groups && draft.groups[groupId]) {
      delete draft.groups[groupId];
    }
  });

  return updatedScene;
};

/**
 * Add items to existing group
 * Returns updated scene state
 */
export const addItemsToGroup = (
  itemIds: string[],
  groupId: string,
  scene: Scene
): Scene | null => {
  if (!scene.groups || !scene.groups[groupId]) {
    return null;
  }

  const updatedScene = produce(scene, (draft) => {
    const group = draft.groups![groupId];
    // Add items to group (avoid duplicates)
    const newItemIds = [...new Set([...group.itemIds, ...itemIds])];
    group.itemIds = newItemIds;
  });

  return updatedScene;
};

/**
 * Remove items from group
 * Returns updated scene state
 */
export const removeItemsFromGroup = (
  itemIds: string[],
  groupId: string,
  scene: Scene
): Scene => {
  if (!scene.groups || !scene.groups[groupId]) {
    return scene;
  }

  const group = scene.groups[groupId];
  const newItemIds = group.itemIds.filter((id) => !itemIds.includes(id));

  if (newItemIds.length === 0) {
    // If group is empty, delete it
    return ungroupItems(groupId, scene);
  }

  const updatedScene = produce(scene, (draft) => {
    draft.groups![groupId].itemIds = newItemIds;
  });

  return updatedScene;
};

/**
 * Get group containing item
 */
export const getGroupForItem = (
  itemId: string,
  scene: Scene
): Group | null => {
  const groups = scene.groups || {};

  for (const group of Object.values(groups)) {
    if (group.itemIds.includes(itemId)) {
      return group;
    }
  }

  return null;
};

/**
 * Get all groups containing any of the selected items
 */
export const getGroupsForItems = (
  items: ItemReference[],
  scene: Scene
): Group[] => {
  const itemIds = items
    .filter((item) => item.type === 'ITEM')
    .map((item) => item.id);

  const groups = scene.groups || {};
  const matchingGroups: Group[] = [];

  for (const group of Object.values(groups)) {
    if (itemIds.some((id) => group.itemIds.includes(id))) {
      matchingGroups.push(group);
    }
  }

  return matchingGroups;
};

