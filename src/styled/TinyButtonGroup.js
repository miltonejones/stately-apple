
import React from 'react';
import { styled, Box } from '@mui/material';
import TinyButton from './TinyButton';
import Nowrap from './Nowrap';
  
const TinyBox = styled(Box)(({ theme, width, active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(active ? 1 : 0),
  backgroundColor: !active ? theme.palette.common.white : theme.palette.primary.dark,
  padding: theme.spacing(0, 0.5),
  color: active ? theme.palette.common.white : theme.palette.primary.dark,
  border: 'solid 1px ' + theme.palette.primary.main,
  '&:last-child': {
    borderRadius: theme.spacing(0, .5, .5, 0)
  },
  '&:first-child': {
    borderRadius: theme.spacing(.5, 0, 0, .5)
  },
  '& .inner': {
    width: 0,
    overflow: "hidden",
    transition: "width 0.2s linear"
  },
  '&:hover': {
    '& .inner': {
      width: "fit-content"
    },
  },
}));

const Expand = ({ children, ...props}) => {
  const ref = React.useRef(null);
  return <TinyBox {...props} ref={ref} width={ref.current?.width}>
    {children}
  </TinyBox>
}


const TinyButtonGroup = ({ buttons, label, value, values = [], onChange, ...props }) => {
  const sx = {
    display: "grid",
    gridTemplateColumns: buttons.map(f => 'auto').join(" ")
  }

  return <Box {...props} sx={{...props.sx, ...sx}}>
    {buttons.map((button, i) => <Expand first={i === 0} active={values[i] === value}
    onClick={e => onChange(values[i])} > 
      <TinyButton color="inherit" key={button} icon={button} />
     {!!label && <Nowrap cap hover className={values[i] === value ? "" : "inner"} small>{values[i]}</Nowrap>}
    </Expand>)}
  </Box>
}

export default TinyButtonGroup;
