import React from 'react';
import PropTypes from 'prop-types';
import {
  styled,
  Snackbar,
  Typography,
  Stack,
  LinearProgress,
} from '@mui/material';

import Btn from './Btn';

/**
 * A Snackbar component used to display messages with a progress bar
 *
 * @param {Object} props - The props object
 * @param {string} props.message - The message to display
 * @param {number} props.progress - The progress value (between 0 and 100)
 * @param {function} props.onClose - The function to execute when the user clicks on the cancel button
 * @param {string} props.caption - The caption to display under the message
 * @param {boolean} props.open - A boolean that indicates whether or not the Snackbar is open
 */
function MessageSnackbar(props) {
  const { message, progress, onClose, caption, open } = props;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={open}
      action={
        <>
          <Btn color="inherit" size="small" onClick={onClose}>
            Cancel
          </Btn>
        </>
      }
      message={
        <Stack sx={{ minWidth: 300 }}>
          <Typography variant="body2">{message}</Typography>
          <Typography variant="caption" color="textSecondary">
            {caption}
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Stack>
      }
    ></Snackbar>
  );
}

MessageSnackbar.propTypes = {
  message: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  caption: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
};

export const Typo = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
}));

export default MessageSnackbar;