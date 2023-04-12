import React from 'react';
import { Paper, Autocomplete } from '@mui/material'; 
import IconTextField from './IconTextField';
import Flex from './Flex';
import Nowrap from './Nowrap';
import PropTypes from 'prop-types';
import TinyButton from './TinyButton';
import { searchStyles } from './searchStyles'; 

/**
 * This component renders a search box with autocomplete functionality.
 * @param {Array} options - An array of options that can be selected from.
 * @param {Function} onChange - A function that is called when the search box value changes.
 * @param {String} name - The name of the search box.
 * @param {String} value - The current value of the search box.
 * @param {Function} onUserSelect - A function that is called when a user selects an option.
 */
function SearchBox({ options = [], onChange, name, value, onUserSelect, ...props }) {
  const classes = searchStyles();

  /**
   * This function handles the change in value for the search box.
   * @param {String} value - The new value of the search box.
   */
  const handleChange = (value) => {
    onChange({ 
      target: {
        name: name,
        value: value
      }
    });
  }

  /**
   * This function renders an option in the autocomplete dropdown.
   * @param {Object} props - Props passed to this component.
   * @param {String} option - The option to render.
   */
  const renderOption = (props, option) => {
    return (
      <Flex {...props} spacing={1}>
        <TinyButton icon="AccessTime" />
        <Nowrap small muted>{option}</Nowrap>
      </Flex>
    );
  }

  return (
    <Autocomplete
      autoFocus
      freeSolo
      options={options}
      value={value}
      PaperComponent={(props) => (
        <Paper variant="outlined" {...props} /> // Changed styling to variant outlined
      )}
      PopperProps={{
        anchorEl: null,
        placement: 'bottom-start',
        style: { marginTop: '-10px' },
      }}
      onChange={(event, value) => {
        onUserSelect(value);
      }}
      onInputChange={(event, value) => {
        handleChange(value);
      }}
      renderInput={(params) => (
        <IconTextField
          {...params}
          googlish 
          autoFocus
          variant="outlined" // Changed variant to outlined
          {...props} 
        />
      )}
      renderOption={renderOption}
      classes={classes}
    />
  );
}

SearchBox.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  name: PropTypes.string,
  value: PropTypes.string,
  onUserSelect: PropTypes.func
}

SearchBox.defaultProps = {
  options: [],
  onChange: () => {},
  name: '',
  value: '',
  onUserSelect: () => {}
}
 

export default SearchBox;