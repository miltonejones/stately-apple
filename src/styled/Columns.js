import { styled, Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * A responsive grid container with flexible columns using Material-UI Box and styled-components.
 * @component
 * @param {object} props - The props of the component.
 * @param {number} [props.spacing=1] - The spacing between grid items (in Material-UI theme spacing units).
 * @param {string} [props.columns='1fr 1fr'] - The grid template columns (in CSS columns format).
 * @returns {JSX.Element} - The Columns component.
 */

const Columns = styled(Box)(({theme, spacing = 1, columns = '1fr 1fr'}) => ({
  display: 'grid',
  gridTemplateColumns: `${columns}`,
  gap: theme.spacing(spacing),
  alignItems: 'center',
  transition: 'all 0.2s linear'
}))

Columns.propTypes = {
  spacing: PropTypes.number,
  columns: PropTypes.string,
}

Columns.defaultProps = {
  spacing: 1,
  columns: '1fr 1fr',
}

export default Columns;