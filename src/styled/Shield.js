
import React from 'react';
import { styled, Badge } from '@mui/material';

const Shield = styled(({children, ...props}) => <Badge
  {...props} 
    max={10000}
    overlap="circular"
    color="primary"
  >{children}</Badge>)(() => ({
  cursor: 'pointer',
}))

export default Shield;
