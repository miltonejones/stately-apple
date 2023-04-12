import React from 'react';
import PropTypes from 'prop-types';
import { Stack, TextField } from '@mui/material';
import Flex from './Flex';
import Spacer from './Spacer'; 
import TinyButton from './TinyButton';
import Nowrap from './Nowrap';

/**
 * A React functional component that displays a form body.
 * @param {object} props - The component's props.
 * @param {string} props.icon - The icon for the tiny button.
 * @param {boolean} props.error - Determines whether there is an error.
 * @param {function} props.handleChange - Handles changes to the TextField value.
 * @param {object} props.menu - An object containing menu-related properties and functions.
 * @param {string} props.description - The description of the TextField.
 * @param {string} props.label - The label for the TextField.
 * @param {string} props.name - The name for the TextField.
 */
const FormBody = ({ icon, error, handleChange, menu, description, label, name, ...props }) => {
  return (
    <Stack sx={{ p: 2, minWidth: 400 }} spacing={2}>
            
      <Flex sx={{ mb: 1 }} spacing={1}>
        <TinyButton icon={icon} />
        <Nowrap bold small muted>
          {label}{menu.dirty && <>*</>}
        </Nowrap>
        <Spacer />
        {!!menu.data && (
          <TinyButton
            disabled={!menu.dirty || error}
            color="primary"
            icon="Save"
            onClick={menu.handleClose(menu.data[name])}
          />
        )}
        <TinyButton icon={menu.dirty ? "Circle" : "Close"} onClick={menu.handleClose()} />
      </Flex>

      <Nowrap variant="body1">{description}</Nowrap>

      {!!menu.data && (
        <TextField
          autoFocus
          onKeyUp={(e) =>
            e.keyCode === 13 && menu.handleClose(menu.data[name])(e)
          }
          error={error}
          disabled={error}
          helperText={
            error
              ? 'If you close now you will lose your unsaved changes!'
              : ''
          }
          size="small"
          autoComplete="off"
          value={menu.data[name]}
          onChange={handleChange}
          {...props}
        />
      )}
    </Stack>
  );
}

FormBody.propTypes = {
  icon: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  menu: PropTypes.object.isRequired,
  description: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default FormBody;
 