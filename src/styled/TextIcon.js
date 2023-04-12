import React from 'react';
import PropTypes from 'prop-types';
import * as Icons from "@mui/icons-material";

/**
 * Returns an icon or an empty <i> element, based on the icon prop
 * @param {Object} props - The props object
 * @param {string} props.icon - The icon to render. Must be a string that matches an icon from the imported Icons object
 */
const TextIcon = ({ icon , ...props}) => {
  if (typeof icon === 'string') {
    const Icon = Icons[icon];
    if (Icon) {
      return <Icon {...props}/>
    }
    return <i />
  } 
 
  return <i/>
} 

// Define the expected propTypes for component props
TextIcon.propTypes = {
  icon: PropTypes.string.isRequired
}

// Add a default value for the icon prop
TextIcon.defaultProps = {
  icon: ''
}

export default TextIcon;
 
/* 
Some potential critiques of the original code:
- The function was not very descriptive or clear in its purpose, which could make maintenance or updates more difficult.
- There were no propTypes defined for the component props, which makes it harder for developers to understand what input values to use.
- The default value for the icon prop was not defined, which could lead to issues if the component is used without providing an icon prop.
- There was no JSDoc comment block for the function, which would make it easier for other developers (including the original developer) to understand how the function is meant to work.
*/