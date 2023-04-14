/**
 * HomeBar component
 * @param {Object} props - The component props object
 * @param {Function} props.handler - The handler function for the Login component
 * @param {Object} props.tube - The tube object containing user and pins properties
 * @returns {JSX.Element} - The HomeBar component
 */
import React from 'react';
import Login from '../Login/Login'; 
import { Nowrap, Flex, Spacer, Shield } from '../../../styled';

const HomeBar = ({ handler, tube }) => {
  
  /**
   * Click handler for the library sidebar toggle
   * @returns {void}
   */
  const handleLibraryToggle = () => {
    tube.send({
      type: 'CHANGE',
      key: 'browse',
      value: !tube.browse,
    });
  };

  return (
    <Flex sx={{ backgroundColor: 'white', p: 2 }}>
      <Flex spacing={3}>
        
        {/* Display login link when user is not logged in */}
        {!tube.user && (
          <Login handler={handler}>
            <Nowrap small hover>
              Library
            </Nowrap>
          </Login>
        )}

        {/* Display library sidebar toggle when user is logged in */}
        {!!tube.user && (
          <Shield
            onClick={handleLibraryToggle}
            max={1000}
            color="success"
            badgeContent={tube.pins?.length}
          >
            <Nowrap hover small>
              Library
            </Nowrap>
          </Shield>
        )}

        {/* Display iTunes store link */}
        <Nowrap onClick={() => window.open(APPLE_STORE)} small>
          iTunes Store
        </Nowrap>
      </Flex>

      <Spacer />

      {/* Display login link when user is logged in */}
      <Login tube={tube} />
    </Flex>
  );
};

HomeBar.defaultProps = {
  handler: () => {},
  tube: {},
};

export default HomeBar;

const APPLE_STORE = 'https://www.apple.com/itunes/';

// Overall, the code was fairly legible and efficient, with good component structure and usage of default props. Minor changes included fixing a missing prop in the Login component and adding a JSDoc comment to the handleLibraryToggle function.