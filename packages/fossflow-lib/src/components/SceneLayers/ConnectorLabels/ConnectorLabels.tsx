import { useMemo, memo } from 'react';
import { useScene } from 'src/hooks/useScene';
import { ConnectorLabel } from './ConnectorLabel';

interface Props {
  connectors: ReturnType<typeof useScene>['connectors'];
}

export const ConnectorLabels = memo(({ connectors }: Props) => {
  const labeledConnectors = useMemo(
    () =>
      connectors.filter((connector) => {
        return Boolean(
          connector.description ||
            connector.startLabel ||
            connector.endLabel ||
            (connector.labels && connector.labels.length > 0)
        );
      }),
    [connectors]
  );

  return (
    <>
      {labeledConnectors.map((connector) => {
        return <ConnectorLabel key={connector.id} connector={connector} />;
      })}
    </>
  );
});

ConnectorLabels.displayName = 'ConnectorLabels';
