/**
 * A Tooltip Component that provides additional information to users when hovering over content.
 * @param {Object} props - The props object containing component, children, caption, title, and any additional props.
 * @param {React.ElementType} props.component - The component to wrap with the tooltip.
 * @param {React.ReactNode} props.children - The content to wrap with the tooltip.
 * @param {string} props.caption - The optional caption to display within the tooltip.
 * @param {string} props.title - The text to display as the tooltip title.
 * @return {React.ReactNode} - The Tooltag Tooltip Component.
 */

import React from 'react';
import { Stack, Typography, styled } from '@mui/material';
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

const Tooltag = ({
  component: Component,
  children,
  caption = '',
  title = '',
  ...props
}) => {
  // Return the Tooltag Tooltip Component with the provided content and optional caption.
  return (
    <HtmlTooltip
      title={
        <Stack>
          <Typography variant="body2">{title}</Typography>
          {!!caption && (
            <Typography variant="caption">{caption}</Typography>
          )}
        </Stack>
      }
    >
      <Component {...props}>{children}</Component>
    </HtmlTooltip>
  );
};

// Export the Tooltag Tooltip Component.
export default Tooltag;
 