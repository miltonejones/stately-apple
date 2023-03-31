
// import React from 'react';
import { styled, Typography } from '@mui/material';
//  import { blue } from '@mui/material/colors';

const Nowrap = styled(Typography)(( { theme, selected, color, width, muted, cap, tiny, small, thin, border, bold = false, hover } ) => {
  const obj = {
    cursor:  hover ? "pointer" : 'default',
    fontWeight:  bold ? 600 : 400,
    // backgroundColor: odd ? blue[50] : theme.palette.common.white,
    padding: selected ? theme.spacing(0.5) : 0,
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
    backgroundColor: selected ? theme.palette.primary.light : null ,
    width:  width || '',
    color: selected ? theme.palette.primary.dark : (muted ? theme.palette.text.secondary : null) ,
    '&:hover': {
      textDecoration: hover ? 'underline' : 'none'
    }
  };
  if (tiny) {
    Object.assign(obj, {
      fontSize: '0.75rem'
    })
  }
  if (small) {
    Object.assign(obj, {
      fontSize: '0.85rem'
    })
  }
  if (border) {
    Object.assign(obj, {
      borderBottom: 'solid 1px ' + theme.palette.divider
    })
  }
  if (thin) {
    Object.assign(obj, {
      lineHeight: '1em'
    })
  }

  if (cap) {
    Object.assign(obj, {
      textTransform: 'capitalize'
    })
  }

  if (color && theme.palette[color]){
    Object.assign(obj, {
      color: theme.palette[color].main
    })
  }
  return obj;
})

export default Nowrap;
