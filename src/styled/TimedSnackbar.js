import React from 'react';
import { Snackbar } from '@mui/material';
import { useTimer } from '../machines';

const TimedSnackbar = ({ children, handler, ...props }) => {
  const timer = useTimer({
    auto: 1,
    limit: 6,
  });

  const keys = Object.keys(handler.state.meta);
  if (!keys.length) return <i />
  const { message } = handler.state.meta[keys[0]]
  if (timer.state.matches('done')) return <i />;
  
  return (
    <Snackbar
      {...props}
      open
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      message={message}
    ></Snackbar>
  );
};

export default TimedSnackbar;
