import React from 'react';
import Login from '../Login/Login';
import { Avatar  } from '@mui/material';import {
  Nowrap,
  Flex,
  Spacer, 
  Btn, 
} from '../../../styled';


  
 
const HomeBar = ({ handler, tube }) => {
 return (
  <Flex sx={{ backgroundColor: 'white', p: 2 }}>
  <Flex spacing={3}>
    <Nowrap
      hover
      small
      onClick={() => {
        tube.send({
          type: 'CHANGE',
          key: 'browse',
          value: !tube.browse,
        });
      }}
    >
      Library
    </Nowrap>
    <Nowrap onClick={() => window.open(APPLE_STORE)} small>
      iTunes Store
    </Nowrap>
  </Flex>
  <Spacer />

  {!!handler.login && <Login />}

  {!!tube.user && (
    <Flex spacing={3}>
      <Nowrap hover onClick={() => {
        tube.send('SIGNOUT');
     //   window.location.reload()
      } } small>Sign Out</Nowrap>
      <Avatar>{tube.user.username.substr(0, 2).toUpperCase()}</Avatar>
    </Flex>
  )}

  {!tube.user && (
    <Btn
      variant="contained"
      onClick={() => {
        handler.send({
          type: 'CHANGE',
          key: 'login',
          value: true,
        });
      }}
    >
      Sign Up
    </Btn>
  )}
</Flex>
 );
}
HomeBar.defaultProps = {};
export default HomeBar;

const APPLE_STORE = 'https://www.apple.com/itunes/';