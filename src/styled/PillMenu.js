
import React from 'react';
import { Collapse } from '@mui/material';
import Nowrap from './Nowrap';
import Pill from './Pill';
import Flex from './Flex';
import TinyButton from './TinyButton';

const PillMenu = ({ options, value, onClick }) => {
  return (
    <Flex spacing={1}>
      {!!value && <TinyButton icon="Close" onClick={() => onClick("")} />}
      {options.map(option => <Collapse
        orientation="horizontal"
      in={!value || value === option}
      >
        <Pill onClick={() => onClick(option)}
        active={value === option}>
       <Nowrap hover small>{option}</Nowrap>
      </Pill>
      
      </Collapse>)}
    </Flex>
  )
}

export default PillMenu;
