import './App.css';
import { useApple, useAudio } from './machines';
import { Flex, TextIcon, Nowrap } from './styled';

import AudioPlayer from './components/lib/AudioPlayer/AudioPlayer';
import MusicGrid from './components/lib/MusicGrid/MusicGrid';
import AppBar from './components/lib/AppBar/AppBar';
import AboutModal from './components/lib/AboutModal/AboutModal';

function App() {
  const apple = useApple();
  const audio = useAudio();

  return (
    <>
      <div className={apple.isIdle ? 'App centered' : 'App'}>
        <AppBar handler={apple} />
        {apple.state.matches('search') && <MusicGrid handler={apple} audio={audio} />}
        <AudioPlayer handler={audio} />
      </div>

      

      <Flex
        between
        sx={{ p: (t) => t.spacing(1, 3), height: 'var(--bottom-bar-offset)' }}
        spacing={1}
      >
        <Flex spacing={2} small muted>
          {/* <Nowrap small muted>
            About Boombot
          </Nowrap> */}
          <AboutModal />
          <Nowrap small muted>
            Github Repo
          </Nowrap>
          {/* <Nowrap small muted>Machines</Nowrap> */}
        </Flex>

        <Nowrap
          small
          hover
          muted
          onClick={() =>
            window.open(
              'https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html'
            )
          }
        >
          {' '}
          Powered by the <b>iTunes Search API</b>
        </Nowrap>

        <Flex spacing={1}>
          <TextIcon icon="Apple" />
          <Nowrap small muted>
            <b>Boombot</b>. An xstate web application
          </Nowrap>
        </Flex>
      </Flex>
    </>
  );
}

export default App;
