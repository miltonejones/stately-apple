import React from 'react';
import Login from '../Login/Login'; 
import { Nowrap, Flex, Spacer, Shield } from '../../../styled';

const HomeBar = ({ handler, tube }) => {
  return (
    <Flex sx={{ backgroundColor: 'white', p: 2 }}>
      <Flex spacing={3}>
        {/* login link when user is not logged in */}
        {!tube.user && (
          <Login tube={handler}>
            <Nowrap small hover>
              Library
            </Nowrap>
          </Login>
        )}

        {/* toggle library sidebar link when user is logged in */}
        {!!tube.user && (
          <Shield
              onClick={() => {
                tube.send({
                  type: 'CHANGE',
                  key: 'browse',
                  value: !tube.browse,
                });
              }}
             max={1000} color="success" badgeContent={tube.pins?.length}>
            <Nowrap
              hover
              small>
              Library
            </Nowrap>
          </Shield>
        )}

        {/* iTunes store link  */}
        <Nowrap onClick={() => window.open(APPLE_STORE)} small>
          iTunes Store
        </Nowrap>
      </Flex>
      <Spacer />

      {/* login link when user is logged in */}
      <Login tube={tube} />
    </Flex>
  );
};
HomeBar.defaultProps = {};
export default HomeBar;

const APPLE_STORE = 'https://www.apple.com/itunes/';
