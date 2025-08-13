import React from 'react';
import { Grid } from '@mui/material';
import { IconCollectionStateWithIcons, Icon } from 'src/types';
import { IconCollection } from './IconCollection';

interface Props {
  iconCategories: IconCollectionStateWithIcons[];
  onClick?: (icon: Icon) => void;
  onMouseDown?: (icon: Icon) => void;
}

export const Icons = ({ iconCategories, onClick, onMouseDown }: Props) => {
  return (
    <Grid container spacing={1} sx={{ py: 2 }}>
      {iconCategories.map((cat) => {
        return (
          <Grid
            item
            xs={12}
            key={`icon-collection-${cat.id ?? 'uncategorised'}`}
          >
            <IconCollection
              {...cat}
              onClick={onClick}
              onMouseDown={onMouseDown}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
