import React, { useMemo } from 'react';
import type { useScene } from 'src/hooks/useScene';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { getConnectorGroups } from 'src/utils/connectorGroups';
import { Connector } from './Connector';

interface Props {
  connectors: ReturnType<typeof useScene>['connectors'];
}

export const Connectors = ({ connectors }: Props) => {
  const itemControls = useUiStateStore((state) => {
    return state.itemControls;
  });

  const mode = useUiStateStore((state) => {
    return state.mode;
  });

  const selectedConnectorId = useMemo(() => {
    if (mode.type === 'CONNECTOR') {
      return mode.id;
    }
    if (itemControls?.type === 'CONNECTOR') {
      return itemControls.id;
    }

    return null;
  }, [mode, itemControls]);

  const { focusedId, groupIds } = useMemo(() => {
    if (itemControls?.type === 'CONNECTOR_GROUP') {
      return {
        focusedId: itemControls.focusedId,
        groupIds: new Set(itemControls.ids)
      };
    }
    return { focusedId: null as string | null, groupIds: new Set<string>() };
  }, [itemControls]);

  const groups = useMemo(() => getConnectorGroups(connectors), [connectors]);

  return (
    <>
      {[...connectors].reverse().map((connector) => {
        const group = groups.get(connector.id);

        const isDimmed =
          focusedId !== null &&
          groupIds.has(connector.id) &&
          connector.id !== focusedId;

        return (
          <Connector
            key={connector.id}
            connector={connector}
            isSelected={
              selectedConnectorId === connector.id ||
              connector.id === focusedId
            }
            groupIndex={group?.index ?? 0}
            groupTotal={group?.total ?? 1}
            dimmed={isDimmed}
          />
        );
      })}
    </>
  );
};
