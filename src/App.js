import './App.css';
import { useApple, useTube, useMenu, useAudio } from './machines';
import { Avatar, LinearProgress } from '@mui/material';
import { Flex, TextIcon, Btn, Spacer, Nowrap } from './styled';

import AudioPlayer from './components/lib/AudioPlayer/AudioPlayer';
import MusicGrid from './components/lib/MusicGrid/MusicGrid';
import AppBar from './components/lib/AppBar/AppBar';
import AboutModal from './components/lib/AboutModal/AboutModal';
import TubeDrawer from './components/lib/TubeDrawer/TubeDrawer';
import TubeBrowser from './components/lib/TubeBrowser/TubeBrowser'; 
import Login from './components/lib/Login/Login'; 


import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);



function App() {
  const tubeMenu = useMenu(
    val => val === -1 && tube.send('CLEAR')
  );
  const tube = useTube(
    (res) =>  {
      tubeMenu.handleClick(false, res)
    }
  );
  const apple = useApple();
  const audio = useAudio(); 
// console.log (tube.user)
  return (
    <>
    {!!tube.batch_progress && <LinearProgress value={tube.batch_progress} variant="determinate" />}

      {apple.isIdle && <Flex sx={{ backgroundColor: 'white', p: 2}}>
        
        <Flex spacing={3}>
          <Nowrap hover onClick={() => {
             tube.send({
              type: 'CHANGE',
              key: 'browse',
              value: !tube.browse
            })
          }}>Library</Nowrap>
          <Nowrap>iTunes Store</Nowrap>
        </Flex>
          <Spacer />


        {!!apple.login && <Login />}

        {!!tube.user && <Flex spacing={3}>
          
          <Nowrap>Sign Out</Nowrap>
          <Avatar>{tube.user.username.substr(0,2)}</Avatar>
          
          </Flex>}

         {!tube.user &&  <Btn 
          variant="contained"
          onClick={() => {
            apple.send({
              type: "CHANGE",
              key: 'login',
              value: true
            })
          }}
          >Sign Up</Btn>}


        </Flex>}

      <div className={apple.isIdle ? 'App centered' : 'App'}>
        <AppBar tube={tube} handler={apple} />
{/* <pre>
[{JSON.stringify(tube.user,0,2)}]
</pre> */}
        
        {apple.state.matches('search') && <MusicGrid tube={tube} handler={apple} audio={audio} />}
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
          <Nowrap 
            small
            hover
            muted
            onClick={() =>
              window.open(
                'https://github.com/miltonejones/stately-apple'
              )
            }
           >
            Github Repo
          </Nowrap>
        
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
