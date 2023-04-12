import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Drawer, useTheme, useMediaQuery } from '@mui/material';

/**
 * Renders a flexible menu component that switches to a drawer on smaller screens.
 * @param {object} props - the component's props
 * @param {JSX.Element} props.children - the component's nested children
 * @param {JSX.Element} [props.component=Menu] - the component to use as the default
 * @returns {JSX.Element} - the rendered component
 */
const FlexMenu = ({ children, component: Component = Menu, ...props }) => {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('md'));
  
  // if the screen is small, display as a drawer
  if (small) {
    return (
      <Drawer 
        anchor="bottom" 
        {...props}
      >
        {children}
      </Drawer>
    );
  }

  // otherwise, display as the specified component
  return <Component {...props}>{children}</Component>;
}

// define the expected props and their types
FlexMenu.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType
};

// set default props for the component
FlexMenu.defaultProps = {
  component: Menu
};

export default FlexMenu;