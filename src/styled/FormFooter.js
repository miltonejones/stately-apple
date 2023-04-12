/**
 * FormFooter Component
 * 
 * @param {boolean} error - Whether or not there is an error
 * @param {object} menu - Object containing menu data and functions
 * @param {string} okayText - Text to display on the okay button
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from '@mui/material'; 
import Flex from './Flex';
import Spacer from './Spacer'; 
import Btn from './Btn';

const FormFooter = ({ error, menu, okayText, name, handleClose, dirty, ...props }) => {

  const handleClickCancel = () => {
    menu.send('cancel');
  };

  const handleClickOk = () => {
    menu.send('ok');
  };
 
  return (
    <Flex
      sx={{
        p: 2,
        backgroundColor: (t) => t.palette.grey[200],
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Spacer />

      <Collapse orientation="horizontal" in={error}>
        <Flex spacing={1}>
          <Btn onClick={handleClickCancel}>cancel</Btn>
          <Btn onClick={handleClickOk} variant="contained" color="error">
            close anyway
          </Btn>
        </Flex>
      </Collapse>

      <Collapse orientation="horizontal" in={!error}>
        <Flex spacing={1}>
          <Btn onClick={menu.handleClose()}>cancel</Btn>
          {!!menu.data && (
            <Btn
              disabled={!dirty}
              onClick={menu.handleClose(menu.data[name])}
              variant="contained"
            >
              {okayText}
            </Btn>
          )}
        </Flex>
      </Collapse>

    </Flex>
  );
};

FormFooter.propTypes = {
  error: PropTypes.bool,
  menu: PropTypes.shape({
    send: PropTypes.func,
    handleClose: PropTypes.func,
    data: PropTypes.object,
    dirty: PropTypes.bool,
  }),
  okayText: PropTypes.string,
  name: PropTypes.string,
  handleClose: PropTypes.func,
  dirty: PropTypes.bool,
};

FormFooter.defaultProps = {
  error: false,
  menu: {},
  okayText: 'Okay',
  name: '',
  handleClose: () => {},
  dirty: false,
};

export default FormFooter;
 