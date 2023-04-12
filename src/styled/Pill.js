/**
 * Creates a styled Box component with a pill-shaped background
 * that changes color based on the `active` prop
 * @param {Object} props - Component props
 * @param {boolean} props.active - Determines if the pill is active or not
 * @returns {JSX.Element} - Pill component
 */
import { styled, Box } from '@mui/material';
import PropTypes from 'prop-types';

const Pill = styled(Box)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[200], 
  padding: theme.spacing(0.25, 1),
  borderRadius: theme.spacing(.5),
  display: 'flex',
  color: active ? "white" : theme.palette.text.secondary
}))

Pill.propTypes = {
  active: PropTypes.bool.isRequired,
}

Pill.defaultProps = {
  active: false,
}

export default Pill;