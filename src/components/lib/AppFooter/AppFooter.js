import React from 'react';
import { styled, Box } from '@mui/material';
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(4)
}));
 
const AppFooter = () => {
 return (
   <Layout data-testid="test-for-AppFooter">
     AppFooter Component
   </Layout>
 );
}
AppFooter.defaultProps = {};
export default AppFooter;
