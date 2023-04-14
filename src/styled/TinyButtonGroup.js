/**
 * A group of tiny buttons where only one button can be active at a time.
 * @param {Object} props - The component's props.
 * @param {string[]} props.buttons - The icons for each button.
 * @param {string} [props.label] - The label for the group.
 * @param {string} props.value - The currently selected value.
 * @param {string[]} [props.values] - The values that correspond to each button.
 * @param {Function} props.onChange - A function that is called when the active button changes.
 */

import React from 'react';
import { styled, Box } from '@mui/material';
import TinyButton from './TinyButton';
import Nowrap from './Nowrap';

const TinyBox = styled(Box)(({ theme, width, active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(active ? 1 : 0),
  backgroundColor: active ? theme.palette.primary.dark : theme.palette.common.white,
  padding: theme.spacing(0, 0.5),
  color: active ? theme.palette.common.white : theme.palette.primary.dark,
  border: `solid 1px ${theme.palette.primary.main}`, 
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
  '&:hover .inner': {
    width: "fit-content"
  },
}));

/**
 * A component that expands its width to fit its contents.
 * @param {Object} props - The component's props.
 * @param {*} props.children - The contents of the component.
 */
const Expand = ({ children, ...props}) => {
  const ref = React.useRef(null);
  return <TinyBox {...props} ref={ref} width={ref.current?.width}>
    {children}
  </TinyBox>
}

const TinyButtonGroup = ({ buttons, label, value, values = [], onChange, ...props }) => {
  const columnTemplate = buttons.map(() => 'auto').join(" ");
  const sx = {
    display: "grid",
    gridTemplateColumns: columnTemplate
  }

  return <Box {...props} sx={{...props.sx, ...sx}}>
    {buttons.map((button, i) => (
      <Expand key={button} first={i === 0} active={values[i] === value} onClick={() => onChange(values[i])}> 
        <TinyButton color="inherit" icon={button} />
        {!!label && <Nowrap cap hover className={values[i] === value ? "" : "inner"} small>{values[i]}</Nowrap>}
      </Expand>
    ))}
  </Box>
}

export default TinyButtonGroup;