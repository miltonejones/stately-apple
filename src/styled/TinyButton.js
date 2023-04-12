
import PropTypes from 'prop-types';
import RotateButton from './RotateButton';
import * as Icons from "@mui/icons-material";

/**
 * Renders small button with an icon
 * @param {string} icon - Name of the icon to display
 * @returns {JSX.Element} - React component
 */
const TinyButton = ({ icon, ...props }) => {
  const Icon = Icons[icon] || Icons.Error;

  return (
    <RotateButton {...props} sx={{ width: 18, height: 18 }}>
      <Icon sx={{ width: 16, height: 16 }} />
    </RotateButton>
  );
};

TinyButton.propTypes = {
  icon: PropTypes.string.isRequired,
};

TinyButton.defaultProps = {
  icon: "Error",
};

export default TinyButton;

// Critique: Good job on adding prop-types and default props, but could benefit from additional comments explaining the purpose of the component and its usage.