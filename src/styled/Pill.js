
// import React from 'react';
import { styled, Box } from '@mui/material';

const Pill = styled(Box)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[200], 
  padding: theme.spacing(0.25, 1),
  borderRadius: 1
}))

export default Pill;
