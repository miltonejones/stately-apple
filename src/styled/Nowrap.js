/** 
 * A component that renders a Typography element and applies various styles based on its props
 * @param {object} props - The props object
 * @param {string} props.color - The main color of the element
 * @param {boolean} props.selected - Whether the element is selected
 * @param {boolean} props.error - Whether there is an error related to the element
 * @param {number|string} props.width - The width of the element
 * @param {boolean} props.wrap - Whether the text should wrap or be truncated
 * @param {boolean} props.muted - Whether the text should be muted
 * @param {boolean} props.cap - Whether the text should be capitalized
 * @param {boolean} props.tiny - Whether the font size should be tiny
 * @param {boolean} props.small - Whether the font size should be small
 * @param {boolean} props.thin - Whether the font weight should be thin
 * @param {boolean} props.border - Whether the element should have a border
 * @param {boolean} props.bold - Whether the font weight should be bold
 * @param {boolean} props.fullWidth - Whether the element should have full width
 * @param {boolean} props.hover - Whether the element should change style on hover
 * @returns A styled Typography element with applied styles
 */
import { styled, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const Nowrap = styled(Typography)(
  ({
    theme,
    selected,
    color,
    error,
    width,
    wrap,
    muted,
    cap,
    tiny,
    small,
    thin,
    border,
    bold = false,
    fullWidth,
    hover,
  }) => {
    // Initialize an object to hold the styles to be applied to the element
    const obj = {
      cursor: hover ? 'pointer' : 'default',
      fontWeight: bold ? 600 : 400,
      padding: selected ? theme.spacing(0.5) : 0, 
      backgroundColor: selected ? theme.palette.primary.light : null,
      // backgroundColor: odd ? blue[50] : theme.palette.common.white,
      width: width || '',
      color: error
        ? theme.palette.error.main
        : selected
        ? theme.palette.primary.dark
        : muted
        ? theme.palette.text.secondary
        : null,
      '&:hover': {
        textDecoration: hover ? 'underline' : 'none',
      },
    };
    // If wrap is false, add styles to truncate the text
    if (!wrap) {
      Object.assign(obj, {
        whiteSpace: 'nowrap',
        overflowX: 'hidden',
        textOverflow: 'ellipsis',
      });
    }
    // If fullWidth is true, set the width property to 100%
    if (fullWidth) {
      Object.assign(obj, {
        width: '100%',
      });
    }
    // If tiny is true, decrease the font size
    if (tiny) {
      Object.assign(obj, {
        fontSize: '0.75rem',
      });
    }
    // If small is true, decrease the font size
    if (small) {
      Object.assign(obj, {
        fontSize: '0.85rem',
      });
    }
    // If border is true, add a border element
    if (border) {
      Object.assign(obj, {
        borderBottom: 'solid 1px ' + theme.palette.divider,
      });
    }
    // If thin is true, set the line height to 1em
    if (thin) {
      Object.assign(obj, {
        lineHeight: '1em',
      });
    }
    // If cap is true, capitalize the text
    if (cap) {
      Object.assign(obj, {
        textTransform: 'capitalize',
      });
    }
    // If color matches a property in the theme palette, set it as the color
    if (color && theme.palette[color]) {
      Object.assign(obj, {
        color: theme.palette[color].main,
      });
    }
    // Return the styles to be applied to the element
    return obj;
  }
);

Nowrap.propTypes = {
  color: PropTypes.string,
  selected: PropTypes.bool,
  error: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  wrap: PropTypes.bool,
  muted: PropTypes.bool,
  cap: PropTypes.bool,
  tiny: PropTypes.bool,
  small: PropTypes.bool,
  thin: PropTypes.bool,
  border: PropTypes.bool,
  bold: PropTypes.bool,
  fullWidth: PropTypes.bool,
  hover: PropTypes.bool,
}

Nowrap.defaultProps = {
  selected: false,
  error: false,
  wrap: false,
  muted: false,
  cap: false,
  tiny: false,
  small: false,
  thin: false,
  border: false,
  fullWidth: false,
  hover: false,
}

export default Nowrap;