/**
 * A styled component for a horizontal Stack with equal spacing between its children.
 * @param {Object} props - Props object.
 * @param {number} props.width - The width of the stack.
 * @returns {JSX.Element} A styled Stack component.
 */
import { styled, Stack, Card, Box } from '@mui/material';

export const EqStack = styled(({ width, ...props }) => <Stack direction="row" {...props} />)(({ width }) => ({
  alignItems: "flex-end",
  height: 48,
  width,
  border: "solid 1px",
  borderColor: "divider",
  position: "relative",
}));

/**
 * A styled component for an equalizer bar with gradient colors.
 * @param {Object} props - Props object.
 * @param {number} props.height - The height of the bar.
 * @param {number} props.width - The width of the bar.
 * @returns {JSX.Element} A styled Box component.
 */
export const EqBar = styled(({ height, width, ...props }) => <Box {...props} />)(({ height, width }) => ({
  background:  "linear-gradient(0deg, rgba(2,160,5,1) 0%, rgba(226,163,15,1) 18px, rgba(255,0,42,1) 30px)",
  marginLeft: "1px",
  width,
  height
}));

/**
 * A styled component for a player card.
 * @param {Object} props - Props object.
 * @param {boolean} props.open - Whether or not the player is open.
 * @param {boolean} props.small - Whether or not the player is small.
 * @param {Object} props.theme - The MUI theme object.
 * @returns {JSX.Element} A styled Card component.
 */
export const Player = styled(({ open, small, theme, ...props }) => <Card {...props} />)(({ open, small, theme }) => ({
  position: 'fixed',
  bottom:  open ? 'var(--bottom-bar-offset)' : -400,
  transition: "all 0.2s linear",
  height: small ? 80 : 116,
  width: '100vw',
  left: 0,
  backgroundColor: 'white'
}));

// Critiques:
// - The variable names can be made more descriptive without breaking anything.
// - The default values for props can be added wherever applicable.
// - More verbose comments can help improve readability.