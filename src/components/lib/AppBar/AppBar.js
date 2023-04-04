import React from 'react';
import { Badge, styled, Stack, IconButton, LinearProgress,
  useTheme, useMediaQuery
} from '@mui/material';
import {
  Nowrap,
  Flex,
  Spacer,
  TinyButton,
  IconTextField,
  TextIcon,
  
} from '../../../styled';
import MediaMenu from '../MediaMenu/MediaMenu';

const Layout = styled(({ ...props }) => (
  <Stack {...props} spacing={props.isIdle ? 2 : 0} direction={props.isIdle ? 'column' : 'row'} />
))(({ theme, isIdle }) => ({
  backgroundColor: theme.palette.common.white, //isIdle ? theme.palette.common.white : theme.palette.grey[200]
  padding: theme.spacing(1, 3),
  marginBottom: theme.spacing(1),
}));

const AppBar = ({ handler, tube }) => {
  const theme = useTheme();
  const isSmallOrLess = useMediaQuery(theme.breakpoints.down('md'));
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

    const lgFieldWidth = isSmallOrLess ? '80vw' : '560px';
    const smFieldWidth = isSmallOrLess ? '50vw' : '440px';
  return (
    <>
      {isBusy && <LinearProgress />}
      <Layout isIdle={isIdle} data-testid="test-for-AppBar">
        <Flex spacing={isIdle ? 0.5 : 0} sx={{ p: 1 }}>
{/* {JSON.stringify(isSmallOrLess)} */}
          {!isIdle && <Badge max={1000} color="success" badgeContent={tube.pins?.length}><IconButton  onClick={handleBrowse}>
              <TextIcon icon="Menu" />
            </IconButton></Badge>}

          <TextIcon
            color="success"
            sx={
              isIdle
                ? {
                    width: 76,
                    height: 76,
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
              variant={isIdle ? 'h1' : 'h5'}
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
              startIcon={isSmallOrLess ? null : <IconButton>
                <TextIcon icon={"MusicNote"} />
              </IconButton>}

              endIcon={
                <Flex spacing={1}>
                  <IconButton>
                    <TextIcon
                      onClick={() =>
                        handler.send(isListening ? 'STOP' : 'SPEAK')
                      }
                      icon={isListening ? 'MicOff' : 'Mic'}
                    />
                  </IconButton>
              
                  <IconButton>
                    <TextIcon
                      onClick={() => handler.send('CLOSE')}
                      icon={isIdle ? 'Search' : 'Close'}
                    />
                  </IconButton>
                </Flex>
              }
            />
            {/* {JSON.stringify(handler.state.value)} */}
          </Flex>
        </form>

       {!isSmallOrLess && <MediaMenu handler={handler} />}
      </Layout>
    </>
  );
};
AppBar.defaultProps = {};
export default AppBar;
