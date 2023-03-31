import React from 'react';
import { styled, Stack, LinearProgress } from '@mui/material';
import { Nowrap, Flex, Spacer, IconTextField, TextIcon } from '../../../styled';
import MediaMenu from '../MediaMenu/MediaMenu';
 


const Layout = styled(({ ...props }) => (
  <Stack {...props} direction={props.isIdle ? "column" : "row"} />
))(({ theme, isIdle }) => ({ 
  backgroundColor: theme.palette.common.white//isIdle ? theme.palette.common.white : theme.palette.grey[200]
}));

 
 
const AppBar = ({ handler }) => {
  const colors = ['info', 'error', 'success', 'warning'];
  const isIdle = handler.state.matches("idle");
  const isBusy = handler.state.matches("search.lookup");
 return (
  <>
  {isBusy && <LinearProgress />}
   <Layout isIdle={isIdle} data-testid="test-for-AppBar">
 

        <Flex spacing={isIdle ? 0.5 : 0} sx={{p:1}}>
            
              <TextIcon  color="success"
              sx={isIdle ? {
                width: 76,
                height: 76
               } : {}} icon="Apple" />
            
           
             { ['B','o','o','m','b','o', 't'].map((ltr, i) => <Nowrap
              key={i}
              color={colors[i % colors.length]}
              variant={isIdle ? "h1" : "h5"}
             >{ltr}</Nowrap>)}
            
          </Flex>

          {!isIdle && <Spacer />}

          <form  onSubmit={(e) => {
              e.preventDefault()
            handler.send('FIND');
          }}>
        <Flex spacing={1} sx={{p:1}}>
            <IconTextField
              placeholder="Type  a song name or artist"
              label="Find any music"
              size="small"
              sx={{ width: isIdle ? 520 : 300 }}
              onChange={handler.setProp}
              value={handler.param}
              name="param"
              startIcon={<TextIcon 
                  icon="MusicNote"
                />}

              endIcon={<TextIcon
                onClick={() => handler.send('CLOSE')}
                  icon={isIdle ? "Search" : "Close"}
                />}

            />
 
          </Flex>
      </form>

      <MediaMenu handler={handler} />
 

          

   </Layout>
  </>
 );
}
AppBar.defaultProps = {};
export default AppBar;
 