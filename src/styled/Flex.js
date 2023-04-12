// Import necessary dependencies 
import PropTypes from 'prop-types';
import { styled, Box } from "@mui/material";

/**
 * Functional React component that returns a styled `Box` element with flexible formatting properties.
 * 
 * @param {Object} props - Component props
 * @param {Object} [props.theme] - MUI theme object
 * @param {Boolean} [props.base=false] - If `true`, aligns items to the baseline
 * @param {Boolean} [props.center=false] - If `true`, aligns items to the center
 * @param {String} [props.wrap="nowrap"] - Value to define wrapping properties, defaults to "nowrap"
 * @param {Boolean} [props.between=false] - If `true`, justifies content with space between items
 * @param {Boolean} [props.bold=false] - If `true`, sets font weight to 600
 * @param {Number} [props.spacing=0] - Number of pixels to set item spacing
 * @returns {JSX.Element}
 */
const Flex = styled(Box)(({ theme, base, center, wrap = "nowrap", between, bold = false, spacing = 0 }) => ({
  gap: theme.spacing(spacing), // Set item spacing
  cursor: "default", // Set default cursor
  display: "flex", // Set display type to flexbox
  fontWeight: bold ? 600 : 400, // Set font weight option
  alignItems: base ? "baseline" : "center", // Align items based on `base` prop
  justifyContent: center ? "center" : between ? "space-between" : "flex-start", // Set content justification based on props
  whiteSpace: wrap, // Set wrapping rules
  flexWrap: wrap // Set flexbox wrapping rules
}));

// Define component prop types
Flex.propTypes = {
  theme: PropTypes.object,
  base: PropTypes.bool,
  center: PropTypes.bool,
  wrap: PropTypes.string,
  between: PropTypes.bool,
  bold: PropTypes.bool,
  spacing: PropTypes.number
};

// Define default component prop values
Flex.defaultProps = {
  base: false,
  center: false,
  wrap: "nowrap",
  between: false,
  bold: false,
  spacing: 0
};

export default Flex;