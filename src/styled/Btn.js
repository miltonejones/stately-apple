import { styled, Button } from '@mui/material';

/**
 * A styled button component based on the MUI Button.
 * @param {boolean} hover - Determines whether or not the button is being hovered over.
 */  
const Btn = styled(Button)(({ hover, theme }) => ({
  textTransform: hover ? 'none' : 'capitalize',
  textDecoration: hover ? 'underline' : 'none',
  borderRadius: 20,
  padding: theme.spacing(0.5, 3)
}));

export default Btn;