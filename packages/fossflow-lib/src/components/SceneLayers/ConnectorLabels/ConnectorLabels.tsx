import React, { useMemo } from 'react';
import { useScene } from 'src/hooks/useScene';
import { getConnectorGroups } from 'src/utils/connectorGroups';
import { ConnectorLabel } from './ConnectorLabel';

interface Props {
  connectors: ReturnType<typeof useScene>['connectors'];
}

export const ConnectorLabels = ({ connectors }: Props) => {
  const groups = useMemo(() => getConnectorGroups(connectors), [connectors]);

  return (
    <>
      {connectors
        .filter((connector) => {
          return Boolean(
            connector.description ||
              connector.startLabel ||
              connector.endLabel ||
              (connector.labels && connector.labels.length > 0)
          );
        })
        .map((connector) => {
          const group = groups.get(connector.id);
          return (
            <ConnectorLabel
              key={connector.id}
              connector={connector}
              groupIndex={group?.index ?? 0}
              groupTotal={group?.total ?? 1}
            />
          );
        })}
    </>
  );
};
