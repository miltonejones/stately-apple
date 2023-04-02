import React from 'react';
import { styled, Box } from '@mui/material';
import { withAuthenticator } from '@aws-amplify/ui-react';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(4)
}));
 
const Login = () => {
 return (
   <Layout data-testid="test-for-Login">
     Login Component
   </Layout>
 );
}
Login.defaultProps = {}; 
export default withAuthenticator(Login);