import './App.css';
import { useApple, useTube, useMenu, useAudio } from './machines';
import { LinearProgress } from '@mui/material';
import { Flex, TextIcon, Nowrap } from './styled';

import AudioPlayer from './components/lib/AudioPlayer/AudioPlayer';
import MusicGrid from './components/lib/MusicGrid/MusicGrid';
import AppBar from './components/lib/AppBar/AppBar';
import AboutModal from './components/lib/AboutModal/AboutModal';
import TubeDrawer from './components/lib/TubeDrawer/TubeDrawer';
import TubeBrowser from './components/lib/TubeBrowser/TubeBrowser'; 
import HomeBar from './components/lib/HomeBar/HomeBar';

import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

function App() {
  const tubeMenu = useMenu((val) => val === -1 && tube.send('CLEAR'));
  const tube = useTube((res) => {
    tubeMenu.handleClick(false, res);
  });
  const apple = useApple();
  const audio = useAudio();
  return (
    <>
      {!!tube.batch_progress && (
        <LinearProgress value={tube.batch_progress} variant="determinate" />
      )}

      {apple.isIdle && (
        <HomeBar handler={apple} tube={tube} />
      )}

      <div className={apple.isIdle ? 'App centered' : 'App'}>
        <AppBar tube={tube} handler={apple} />
        {apple.state.matches('search') && (
          <MusicGrid tube={tube} handler={apple} audio={audio} />
        )}
        <AudioPlayer handler={audio} />
      </div>

      <TubeBrowser handler={tube} />
      <TubeDrawer menu={tubeMenu} tube={tube} />

      <Flex
        between
        sx={{ p: (t) => t.spacing(1, 3), height: 'var(--bottom-bar-offset)' }}
        spacing={1}
      >
        <Flex spacing={2} small muted>
          <AboutModal />
          <Nowrap small hover muted onClick={() => window.open(GITHUB_URL)}>
            Github Repo
          </Nowrap>
        </Flex>

        <Nowrap small hover muted onClick={() => window.open(ITUNES_API)}>
          {' '}
          Powered by the <b>iTunes Search API</b>
        </Nowrap>

        <Flex spacing={1}>
          <TextIcon icon="Apple" />
          <Nowrap small muted onClick={() => window.open(XSTATE_HOME)}>
            <b>Boombot</b>. An xstate web application
          </Nowrap>
        </Flex>
      </Flex>
    </>
  );
}

export default App;

const ITUNES_API =
  'https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html';
const GITHUB_URL = 'https://github.com/miltonejones/stately-apple';
const XSTATE_HOME = 'https://xstate.js.org/';
