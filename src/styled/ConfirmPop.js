/**
 * Component for confirming actions with a popover window.
 * @param {Object} props - The props object containing the following:
 * @param {ReactNode} props.children - The child element.
 * @param {function} props.onChange - The function to handle changes.
 * @param {string} props.caption - The caption to display.
 * @param {string} [props.message="Are you sure you want to delete this item?"] - The message to display.
 * @param {string} [props.label="Are you sure?"] - The label to display.
 * @param {string} [props.okayText='Okay'] - The text to display on the okay button.
 */

import React from 'react';
import { Popover, Stack, Box, Typography } from '@mui/material'; 
import PropTypes from 'prop-types';
import { useMenu } from '../machines';
import Flex from './Flex';
import Spacer from './Spacer';
import Nowrap from './Nowrap';
import TinyButton from './TinyButton';
import FlexMenu from './FlexMenu';
import Btn from './Btn';

const ConfirmPop = ({ 
  children, 
  onChange, 
  caption, 
  message = "Are you sure you want to delete this item?",
  label = "Are you sure?", 
  okayText = 'Okay' 
}) => {
  
  // Hook to handle menu state
  const menu = useMenu(onChange);

  // Render method
  return (
    <>
      {/* Box component will contain the child element */}
      <Box onClick={menu.handleClick}>
        {children}
      </Box>

      {/* FlexMenu component will contain Popover, Stack and Buttons */}
      <FlexMenu 
        component={Popover}
        anchorEl={menu.anchorEl}
        onClose={menu.handleClose()}
        open={Boolean(menu.anchorEl)}
      >
        <Stack sx={{ backgroundColor: 'white' }}>
          <Stack sx={{ p: 2, minWidth: 400 , maxWidth: 500 }} spacing={2}>
            <Flex sx={{ mb: 1 }} spacing={1}>
              <TinyButton icon="CheckCircle" />
              <Nowrap bold small muted>
                {label}
              </Nowrap>
              <Spacer />
              <TinyButton icon="Close" onClick={menu.handleClose()} />
            </Flex>

            <Typography variant="body1">{message}</Typography>
            <Nowrap small color="error" bold>{caption}</Nowrap>
          </Stack>
          <Flex
            sx={{
              p: 2,
              backgroundColor: (t) => t.palette.grey[200],
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Spacer />
            {/* Cancel button */}
            <Btn onClick={menu.handleClose()}>cancel</Btn>

            {/* Okay button */}
            <Btn 
              onClick={menu.handleClose(true)}
              variant="contained"
            >
              {okayText}
            </Btn>
          </Flex>
        </Stack>
      </FlexMenu>
    </>
  )
}

// Prop types
ConfirmPop.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  caption: PropTypes.string.isRequired,
  message: PropTypes.string,
  label: PropTypes.string,
  okayText: PropTypes.string
}

export default ConfirmPop;