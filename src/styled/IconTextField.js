import React from 'react';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

const IconTextField = ({ endIcon, startIcon, ...props }) => { 
  const startAdornment = !!startIcon ? (
    <InputAdornment position="start">{startIcon}</InputAdornment>
  ) : null;

  const endAdornment = !!endIcon ? (
    <InputAdornment sx={{ cursor: 'pointer' }} position="end">
      {endIcon}
    </InputAdornment>
  ) : null;

  const inputProps = {
    ...props.InputProps,  
    style: { backgroundColor: "white" }, 
    startAdornment, 
    endAdornment
  } 

  return (
    <TextField
      size="small"
      autoComplete="off"
      InputProps={inputProps}
      {...props}
    />
  );
};

export default IconTextField;
