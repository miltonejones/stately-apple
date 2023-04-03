
import React from 'react';
import { Stack, Typography, styled  } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 240,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));
  

const Tooltag = ({ component: Component, children, caption, title, ...props}) => {
  return <HtmlTooltip title={<Stack>
    <Typography variant="body2">{title}</Typography>
   {!!caption && <Typography variant="caption">{caption}</Typography>}
  </Stack>}>
    <Component {...props}>{children}</Component>
  </HtmlTooltip>
}

export default Tooltag;
