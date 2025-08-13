import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Section } from './Section';

interface Props {
  title: string;
}

export const Header = ({ title }: Props) => {
  return (
    <Section sx={{ py: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Section>
  );
};
