import React from 'react';
import { Popover, Stack, Box } from '@mui/material'; 
import { useMenu } from '../machines'; 
import FormFooter from './FormFooter'; 
import FormBody from './FormBody'; 
import PropTypes from 'prop-types';

/**
 * TextPopover Component: renders a popover containing a form with text fields
 * @param {string} children 
 * @param {string} value 
 * @param {string} description 
 * @param {function} onChange 
 * @param {string} okayText - optional, defaults to 'Okay'
 * @param {string} icon - optional, defaults to "BorderColor"
 * @returns {React.Component}
 */

const TextPopover = ({ 
  children,
  value,
  description,
  onChange,
  okayText = 'Okay',
  icon="BorderColor",
  ...props
}) => {
  // Create a menu hook
  const menu = useMenu((val) => {
    !!val && onChange({ name: props.name, target: { value: val } });
  });
  
  // Function to handle changes to the text field
  const handleChange = (event) => {
    menu.send({
      type: 'change',
      key: event.target.name,
      value: event.target.value,
    });
  };
  
  // Determine if there is an error
  const error = menu.state.matches('opened.confirm');
  
  return (
    <>
      <Box onClick={(e) => menu.handleClick(e, { [props.name]: value })}>
        {children}
      </Box>
      
      {/* Render the popover using the menu hook */}
      <Popover
        anchorEl={menu.anchorEl}
        onClose={error ? () => menu.send('ok') : menu.handleClose()}
        open={Boolean(menu.anchorEl)}
      >
        <Stack sx={{ backgroundColor: 'white' }}>
          {/* Render the form body */}
          <FormBody
            icon={icon}
            error={error}
            handleChange={handleChange}
            menu={menu}
            description={description}
            {...props}
          />

          {/* Render the form footer */}
          <FormFooter
            error={error}
            menu={menu}
            okayText={okayText}
            {...props}
            />

        </Stack>
      </Popover>
    </>
  );
};

// Add propTypes to the TextPopover component
TextPopover.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  okayText: PropTypes.string,
  icon: PropTypes.string
};

export default TextPopover;
 