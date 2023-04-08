import React from 'react';
import {
  styled,
  Snackbar,
  Typography,
  Stack,
  LinearProgress,
} from '@mui/material';
import Btn from './Btn';

export const Typo = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
}));

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
          <Typo variant="body2">{message}</Typo>
          <Typo variant="caption" color="textSecondary">
            {caption}
          </Typo>
          <LinearProgress variant="determinate" value={progress} />
        </Stack>
      }
    ></Snackbar>
  );
}

export default MessageSnackbar;
