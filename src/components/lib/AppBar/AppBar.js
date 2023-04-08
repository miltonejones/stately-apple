import React from 'react';
import { 
  styled,
  Stack, 
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Nowrap,
  Flex,
  Spacer,
  TinyButton, 
  TextIcon,
  SearchBox, 
  Shield
} from '../../../styled';
import MediaMenu from '../MediaMenu/MediaMenu';
import Login from '../Login/Login';

const Layout = styled(({ ...props }) => (
  <Stack
    {...props}
    spacing={props.isIdle ? 2 : 0}
    direction={props.isIdle ? 'column' : 'row'}
  />
))(({ theme, small, isIdle }) => ({
  backgroundColor: theme.palette.common.white, 
  padding: small ? theme.spacing(1) : theme.spacing(1, 3),
  marginBottom: small ? 0 : theme.spacing(1),
  alignItemms: 'center', 
}));

const AppBar = ({ handler, tube, small }) => { 
  const { isMobileViewPort } = handler;
  const colors = ['info', 'error', 'success', 'warning'];
  const { isIdle } = handler;
  const isBusy = ['search.lookup', 'search.list.entity'].some(
    handler.state.matches
  );
  const isListening = handler.state.matches('transcribe.listening');
  const handleBrowse = () => {
    tube.send({
      type: 'CHANGE',
      key: 'browse',
      value: !tube.browse,
    });
  };

  const lgFieldWidth = isMobileViewPort ? '80vw' : '560px';
  const smFieldWidth = isMobileViewPort ? '55vw' : '440px';
  const headerTag = isMobileViewPort ? 'h3' : 'h1';
  const smallTag = isMobileViewPort ? 'body1' : 'h5';
  const iconSize = isMobileViewPort ? 48 : 76;
  return (
    <>
      {isBusy && <LinearProgress />}
      <Layout
        small={isMobileViewPort}
        isIdle={isIdle}
        data-testid="test-for-AppBar"
      >
        <Flex spacing={isIdle ? 0.5 : 0} sx={{ p: isMobileViewPort ? 0 : 1 }}>
          {!tube.user && !isIdle && <Login tube={tube} />}

          {!isIdle && !!tube.user && (
            <Shield
              max={10000}
              overlap="circular"
              color="success"
              badgeContent={tube.pins?.length}
              onClick={() => !!tube.user && handleBrowse()}
            >
              <IconButton>
                <TinyButton icon="Menu" />
              </IconButton>
            </Shield>
          )}

          <TextIcon
            color="success"
            sx={
              isIdle
                ? {
                    width: iconSize,
                    height: iconSize,
                  }
                : {
                    display: 'none',
                  }
            }
            icon="Apple"
          />
          <Flex
            spacing={isIdle ? 0.5 : 0}
            onClick={() => handler.send('CLOSE')}
          >
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
        </Flex>

        {!isIdle && <Spacer />}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handler.send('FIND');
          }}
        > 
          <Flex spacing={1} sx={{ mt: 1, justifyContent: 'center' }}>
            <SearchBox
              placeholder={
                isListening
                  ? 'Say the name of a song or artist'
                  : 'Type  a song name or artist'
              }
              googlish={isIdle}
              size="small"
              sx={{ width: isIdle ? lgFieldWidth : smFieldWidth }}
              onChange={handler.setProp}
              onUserSelect={(val) => {
                handler.setProp('param', val);
                handler.send('FIND');
              }}
              value={handler.param}
              options={handler.memory}
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
                ) : (
                  ''
                )
              }
              startIcon={
                isMobileViewPort ? null : (
                  <IconButton>
                    <TextIcon icon={'MusicNote'} />
                  </IconButton>
                )
              }
              endIcon={
                <Flex spacing={1}>
                  <IconButton color={isListening ? 'error' : 'inherit'}>
                    <TextIcon
                      onClick={() =>
                        handler.send(isListening ? 'STOP' : 'SPEAK')
                      }
                      icon={isListening ? 'MicOff' : 'Mic'}
                    />
                  </IconButton>

                  {!small && (
                    <IconButton>
                      <TextIcon
                        onClick={() => handler.send('CLOSE')}
                        icon={isIdle ? 'Search' : 'Close'}
                      />
                    </IconButton>
                  )}
                </Flex>
              }
            /> 
          </Flex>
        </form>

        {!isMobileViewPort && <MediaMenu handler={handler} />} 
      </Layout>
    </>
  );
};
AppBar.defaultProps = {};
export default AppBar;
