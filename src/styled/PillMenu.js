/***
* A component that displays a menu of Pills
* @component
* 
* @param {Array} options - An array of options to display as Pills
* @param {string} value - The current selected value
* @param {function} onClick - A function to handle onClick event of Pills
*/
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Collapse } from '@mui/material';
import Nowrap from './Nowrap';
import Pill from './Pill';
import Flex from './Flex';
import TinyButton from './TinyButton';

const PillMenu = ({ options, value, onClick }) => {

  return (
    // Use Flex to display the Pills
    <Flex spacing={!!value ? 0 : 0.25}>
      
      {/* If a value is selected, show a close button */}
      {!!value && (
        <Box sx={{ mr: 1 }}>
          <TinyButton icon="Close" onClick={() => onClick('')} />
        </Box>
      )}
      
      {/* Display the options as Pills */}
      {options.map((option) => (
        <Collapse orientation="horizontal" in={!value || value === option} key={option}>
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

PillMenu.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

PillMenu.defaultProps = {
  value: ''
}

export default PillMenu;