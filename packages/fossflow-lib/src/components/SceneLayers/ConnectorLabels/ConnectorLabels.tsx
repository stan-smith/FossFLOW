import React from 'react';
import { useScene } from 'src/hooks/useScene';
import { ConnectorLabel } from './ConnectorLabel';

interface Props {
  connectors: ReturnType<typeof useScene>['connectors'];
}

export const ConnectorLabels = ({ connectors }: Props) => {
  return (
    <>
      {connectors
        .filter((connector) => {
          return Boolean(connector.description);
        })
        .map((connector) => {
          return <ConnectorLabel key={connector.id} connector={connector} />;
        })}
    </>
  );
};
