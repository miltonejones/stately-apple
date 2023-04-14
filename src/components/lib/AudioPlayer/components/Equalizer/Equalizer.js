/**
 * Component that renders an equalizer with configurable width and coordinates.
 *
 * @param {Object[]} coords - An array of objects representing the coordinates of each bar in the equalizer.
 * @param {number} coords[].bar_height - The height of the bar, as a percentage of the total height.
 * @param {number} [width=400] - The desired width of the component in pixels.
 *
 * @returns {JSX.Element} - The rendered equalizer component.
 */
import React from 'react';
import { Card, Box } from '@mui/material';
import { createBackground } from '../../../../../util/createBackground';
import { EqStack, EqBar } from '../styled';

const Equalizer = ({ coords, width = 400 }) => {
  // Calculate the width of each bar based on the total width of the component.
  const barWidth = Math.floor(width / 32);

  return (
    <Box>
      <Card sx={{ width, mb: 1 }}>
        <EqStack width={width}>
          {/* Create a background image for the equalizer using the 'createBackground' utility function. */}
          <Box sx={{ position: "absolute", top: 0, left: 0 }}>
            <img src={createBackground(width)} alt="cover" />
          </Box>

          {/* Create an 'EqBar' component for each set of coordinates passed in as a prop. */}
          {coords.map(({bar_height}, i) => (
            <EqBar key={i} width={barWidth} height={Math.abs(bar_height / 4)} />
          ))}
        </EqStack>
      </Card>
    </Box>
  )
}

// Set default props for the component.
Equalizer.defaultProps = {
  coords: [],
  width: 400
};

export default Equalizer;

 