import React from 'react';
import { styled, Box } from '@mui/material';
import { withAuthenticator } from '@aws-amplify/ui-react';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const Login = (props) => { 
  React.useEffect(() => {
    window.location.reload();
  }, [])
 return (
   <Layout data-testid="test-for-Login">
    please wait...
   </Layout>
 );
}
Login.defaultProps = {}; 


export default withAuthenticator(Login);