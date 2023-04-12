/**
 * A Snackbar component that disappears after a set amount of time.
 * @param {Object} props The properties for the component.
 * @param {Object} props.handler The state handler for the component.
 * @param {React.ReactNode} props.children The children nodes of the component.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@mui/material';
import { useTimer } from '../machines';

const TimedSnackbar = ({ children, handler, ...props }) => {
  const timer = useTimer({
    auto: 1,
    limit: 6,
  });

  const keys = Object.keys(handler.state.meta);
  
  // If there are no keys in handler state meta, return an empty i element.
  if (!keys.length) return <i />;
  
  // Otherwise, get the message from the first key in handler state meta.
  const { message } = handler.state.meta[keys[0]]
  
  // If the timer is done, return an empty i element.
  if (timer.state.matches('done')) return <i />;
  
  // If the component should be shown, render a Snackbar component.
  return (
    <Snackbar
      {...props}
      open
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      message={message}
    ></Snackbar>
  );
};

// Define the prop-types for the component.
TimedSnackbar.propTypes = {
  children: PropTypes.node,
  handler: PropTypes.object.isRequired
};

// Set default properties for the component.
TimedSnackbar.defaultProps = {
  children: null
};

export default TimedSnackbar;


// Critiques:
// - It would be helpful to have a clearer explanation of what useTimer does.
// - The code could benefit from more descriptive variable names. Some of the names are too generic and don't convey enough information.