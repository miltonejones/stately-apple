import React from 'react';
import { Box, Collapse } from '@mui/material';
import Nowrap from './Nowrap';
import Pill from './Pill';
import Flex from './Flex';
import TinyButton from './TinyButton';

const PillMenu = ({ options, value, onClick }) => {
  return (
    <Flex spacing={!!value ? 0 : 0.25}>
      {!!value && (
        <Box sx={{ mr: 1 }}>
          <TinyButton icon="Close" onClick={() => onClick('')} />
        </Box>
      )}
      {options.map((option) => (
        <Collapse orientation="horizontal" in={!value || value === option}>
          <Pill onClick={() => onClick(option)} active={value === option}>
            <Nowrap hover tiny>
              {option}
            </Nowrap>
          </Pill>
        </Collapse>
      ))}
    </Flex>
  );
};

export default PillMenu;
