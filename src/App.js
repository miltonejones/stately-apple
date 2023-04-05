import './App.css';
import { useApple, useTube, useMenu, useAudio } from './machines';
import { LinearProgress } from '@mui/material';

import AudioPlayer from './components/lib/AudioPlayer/AudioPlayer';
import MusicGrid from './components/lib/MusicGrid/MusicGrid';
import AppBar from './components/lib/AppBar/AppBar';
import TubeDrawer from './components/lib/TubeDrawer/TubeDrawer';
import TubeBrowser from './components/lib/TubeBrowser/TubeBrowser';
import HomeBar from './components/lib/HomeBar/HomeBar';
import AppFooter from './components/lib/AppFooter/AppFooter';

import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
Amplify.configure(awsExports);




function App() { 

  const tubeMenu = useMenu((val) => 
    // clear the video window when its closed
  val === -1 && tube.send('CLEAR'));


  const tube = useTube((res) => {
    // open the video window when youtube video is found
    tubeMenu.handleClick(false, res);
  }, tubeMenu.handleClose());


  const apple = useApple();
  const audio = useAudio();

  const { isMobileViewPort, isIdle, isListening, isSearching, hasListItems } = apple;

  return (
    <>
      {/* progress bar for batch import progress  */}
      {!!tube.batch_progress && (
        <LinearProgress value={tube.batch_progress} variant="determinate" />
      )}

      {/* homebar shows only when there are no search results  */}
      {isIdle && <HomeBar handler={apple} tube={tube} />} 

      {/* page doubles as home page and search results  */}
      <div className={isIdle ? 'App centered' : 'App'}>

        {/* search bar works on home page and becomes a toolbar when not idle  */}
        <AppBar small={isMobileViewPort} tube={tube} handler={apple} />

        {/* show search results when present */}
        {(isSearching || (isListening && hasListItems)) && (
          <MusicGrid small={isMobileViewPort} tube={tube} handler={apple} audio={audio} />
        )}

        {/* itunes sample audio player  */}
        <AudioPlayer small={isMobileViewPort} handler={audio} />
      </div>

      {/* youtube video sidebar */}
      <TubeBrowser small={isMobileViewPort} searchText={apple.searchText} handler={tube} />

      {/* youtube video player  */}
      <TubeDrawer small={isMobileViewPort} menu={tubeMenu} tube={tube} />

      {/* app footer  */}
      <AppFooter small={isMobileViewPort} />
    </>
  );
}

export default App;
