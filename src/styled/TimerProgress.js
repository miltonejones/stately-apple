import React from 'react';
import { CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import { useTimer } from '../machines';

/**
 * A component that displays a progress bar indicating the time elapsed.
 *
 * @component
 * @param {Object} props - The props object for TimerProgress.
 * @param {Object} [props.component] - The component to use for the progress bar.
 * @param {boolean} [props.auto=true] - Whether the timer should start automatically.
 * @param {number} [props.limit=15] - The time limit for the timer, in seconds.
 * @returns The TimerProgress component.
 */

const TimerProgress = ({ 
    component: Component = CircularProgress, 
    auto: startAutomatically = true, 
    limit: timeLimit = 15, 
    ...props 
  }) => {

  const timer = useTimer({
    auto: startAutomatically,
    limit: timeLimit,
  });

  // Determine the variant of the progress bar based on the timer state.
  const variant = timer.state.matches('running')
    ? 'determinate'
    : 'indeterminate';

  // If the timer is done, return an empty icon.
  if (timer.state.matches('done')) return <i />;
  
  // Otherwise, return the progress bar with the appropriate props.
  return (
    <Component variant={variant} value={timer.progress} {...props} />
  );
};

// Default props for TimerProgress.
TimerProgress.defaultProps = {
  auto: true,
  limit: 15,
};

// Prop types for TimerProgress.
TimerProgress.propTypes = {
  component: PropTypes.elementType,
  auto: PropTypes.bool,
  limit: PropTypes.number,
};

export default TimerProgress;


// Critique: 
// One potential improvement would be to add more detailed JSDoc comments for the useTimer hook, 
// or to create a separate component that uses the hook and provides more explanatory comments.