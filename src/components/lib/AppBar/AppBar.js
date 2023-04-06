import React from 'react';
import { Badge, styled, Stack, Box, IconButton, LinearProgress } from '@mui/material';
import {
  Nowrap,
  Flex,
  Spacer,
  TinyButton,
  IconTextField,
  TextIcon,
  
} from '../../../styled';
import MediaMenu from '../MediaMenu/MediaMenu';
import Login from '../Login/Login';

const Layout = styled(({ ...props }) => (
  <Stack {...props} spacing={props.isIdle ? 2 : 0} direction={props.isIdle ? 'column' : 'row'} />
))(({ theme, small, isIdle }) => ({
  backgroundColor: theme.palette.common.white, //isIdle ? theme.palette.common.white : theme.palette.grey[200]
  padding: small ? theme.spacing(1) : theme.spacing(1, 3),
  marginBottom: small ? 0 : theme.spacing(1), 
  alignItemms: 'center' 
  // border: 'solid 1px green'
}));

const AppBar = ({ handler, tube, small }) => {
  // const theme = useTheme();
  const { isMobileViewPort } = handler  ;
  const colors = ['info', 'error', 'success', 'warning'];
  const { isIdle } = handler;
  const isBusy = ['search.lookup', 'search.list.entity'].some(handler.state.matches);
  const isListening = handler.state.matches('transcribe.listening');
  const handleBrowse = () => {
      tube.send({
        type: 'CHANGE',
        key: 'browse',
        value: !tube.browse
      })
    };

    const lgFieldWidth = isMobileViewPort ? '80vw' : '560px';
    const smFieldWidth = isMobileViewPort ? '40vw' : '440px';
    const headerTag = isMobileViewPort ? 'h3' : 'h1';
    const smallTag = isMobileViewPort ? 'h6' : 'h5';
    const iconSize = isMobileViewPort ? 48 : 76;
  return (
    <>
      {isBusy && <LinearProgress />}
      <Layout small={isMobileViewPort} isIdle={isIdle} data-testid="test-for-AppBar">
        <Flex spacing={isIdle ? 0.5 : 0} sx={{ p: isMobileViewPort ? 0 : 1 }}>
 
          {!isIdle && <Badge max={10000} color="success" badgeContent={tube.pins?.length}><IconButton  onClick={handleBrowse}>
              <TextIcon icon="Menu" />
            </IconButton></Badge>}

          <TextIcon
            color="success"
            sx={
              isIdle
                ? {
                    width: iconSize,
                    height: iconSize,
                  }
                : {
                  display: 'none'
                }
            }
            icon="Apple"
          />

          {['B', 'o', 'o', 'm', 'b', 'o', 't'].map((ltr, i) => (
            <Nowrap
              key={i}
              color={colors[i % colors.length]}
              variant={isIdle ? headerTag : smallTag}
            >
              {ltr}
            </Nowrap>
          ))}
        </Flex>

        {!isIdle && <Spacer />}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handler.send('FIND');
          }}
        >
          <Flex spacing={1} sx={{ p: 1, justifyContent: 'center' }}>
            <IconTextField
              placeholder={isListening
                ? "Say the name of a song or artist"
                : "Type  a song name or artist"}
              label="Find any music"
              googlish={isIdle}
              size="small"
              sx={{ width: isIdle ? lgFieldWidth : smFieldWidth }}
              onChange={handler.setProp}
              value={handler.param}
              name="param"
              helperText={
                isListening ? (
                  <>
                    Click the <TinyButton icon="MicOff" /> icon to cancel.
                  </>
                ) : isIdle ? (
                  <>
                  Click the <TinyButton icon="Mic" /> icon to use voice.
                </>
                ) : ""
              }
              startIcon={isMobileViewPort ? null : <IconButton>
                <TextIcon icon={"MusicNote"} />
              </IconButton>}

              endIcon={
                <Flex spacing={1} >
                  <IconButton color={isListening ? "error" : "inherit"}>
                    <TextIcon
                      onClick={() =>
                        handler.send(isListening ? 'STOP' : 'SPEAK')
                      }
                      icon={isListening ? 'MicOff' : 'Mic'}
                    />
                  </IconButton>
              
                  {!small && <IconButton>
                    <TextIcon
                      onClick={() => handler.send('CLOSE')}
                      icon={isIdle ? 'Search' : 'Close'}
                    />
                  </IconButton>}
                </Flex>
              }
            />
            {/* {JSON.stringify(handler.state.value)} */}
          </Flex>
        </form>

       {!isMobileViewPort && <MediaMenu handler={handler} />}
      {!isIdle && <Box sx={{mt:1}}>
       <Login />
       </Box>}
      </Layout>
    </>
  );
};
AppBar.defaultProps = {};
export default AppBar;
