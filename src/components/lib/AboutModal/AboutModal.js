import React from 'react';
import { styled, IconButton, Stack, Drawer, Box } from '@mui/material';
import { useApple, useAudio, useTube, useMenu } from '../../../machines';
import {
  Nowrap, 
  Flex,
  Spacer,
  Pill,
  TextIcon, 
  Columns,
} from '../../../styled';

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(4),
  height: '80vh',
}));

const Li = styled(Box)(({ theme, offset }) => ({
  marginLeft: theme.spacing(offset), 
}));

const capitalize = str => str.replace(/_/g, ' ')

const StateTree = ({ state, root , offset = 0}) => {
  const stateKeys = state.states;
  const eventKeys = !state.on ? [] : Object.keys(state.on);
 
  return (
    <Li offset={offset}>


     {!root && <Stack  sx={{ mb: 2}}>
        <Nowrap wrap><b>{state.key}</b>: {state.description}</Nowrap>
        <Nowrap small muted>Path: {state.id}</Nowrap>
        {!!state.invoke?.length && 
          state.invoke.map(invoke => <Nowrap small>Invokes service method: "<b>{invoke.src}</b>"</Nowrap>)} 
      </Stack>}

     {!!root && <Stack  sx={{ mb: 2, mt: 2}}>
        <Nowrap sx={{
          textTransform: 'capitalize'
        }} variant="h6" wrap><b>{capitalize(state.id)}</b></Nowrap>
        <Nowrap small muted>Machine ID: {state.id}</Nowrap>
        <Nowrap small muted>Initial state: <b>{state.initial}</b></Nowrap>
        <Nowrap wrap>{state.description}</Nowrap> 
      </Stack>}


      {!!eventKeys.length && (
        <Box sx={{ mt: 1, ml: offset + 1 }}>
        <Stack sx={{ mb: 1 }}>

          <Nowrap color="info" bold variant="subtitle2">Events in "{state.id}"</Nowrap>
          <Nowrap>The "{state.key}" state supports the following events</Nowrap>

        </Stack>
        
         <Box sx={{ mb: 1 }}> 
            {eventKeys.map((s) => (
              <Li>
                <Stack sx={{ mb: 2}}>
                  <Nowrap bold>{s}</Nowrap>
                 {state.on[s].map(act => (
                  <Box sx={{ mb: 1 }}>
                  <Nowrap small muted>Path: {act.event}</Nowrap>
                    {!!act.cond && <Nowrap small color="error">Condition: {act.cond?.name}</Nowrap>}
                    {!!act.target?.length && <Nowrap muted small>Destination: {act.target.map(act => <>"<b>{JSON.stringify(act.id)}</b>"</>)}</Nowrap>}
                    {!!act.actions?.length && <Nowrap small>Invokes machine action: {act.actions.map(act => <>"<b>{act.type}</b>"</>)}</Nowrap>}
                    <Nowrap sx={{ mt: 1}}>{act.description}</Nowrap> 
                  </Box>
                 ))}
                </Stack>
              </Li>
            ))} 
         </Box>
        </Box>
      )}


      {!!Object.keys(stateKeys).length && (
        <Box sx={{ mt: 1, ml: offset }}>
          <Stack sx={{ mb: 1 }}>

            <Nowrap bold color="info" variant="subtitle2">States in "{state.id}"</Nowrap>
            <Nowrap>The "{state.key}" {root ? "state machine" : "state"} has these child states</Nowrap>

          </Stack>
          
        {Object.keys(stateKeys).map((s) => (
          <StateTree key={s} offset={offset + 1} state={stateKeys[s]} />
        ))}
  
        </Box>
      )}


    </Li>
  );
};

const AboutModal = () => {
  const apple = useApple();
  const audio = useAudio();
  const menu = useMenu();
  const tube = useTube();
  const machines = [apple, audio, tube, menu];
 
  const selectedMachine = machines.find(f => f.diagnosticProps.id === menu.selectedMachine)
  const selectMachine = value => {
    menu.send({
      type: 'prop',
      key: 'selectedMachine',
      value 
    });
  }
  return (
    <>
      <Nowrap onClick={menu.handleClick} hover small muted>
        About Boombot
      </Nowrap>
      <Drawer
        anchor="bottom"
        onClose={menu.handleClose()}
        open={Boolean(menu.anchorEl)}
      >
        <Layout>
          <Flex spacing={1}>
            <Nowrap>State machines</Nowrap>
            {machines.map(mac => (
              <Pill sx={{ textTransform: 'capitalize'}}
                onClick={() => selectMachine( mac.diagnosticProps.id )}
                active={mac.diagnosticProps.id === menu.selectedMachine}
              key={mac.diagnosticProps.id}>
               <Nowrap small hover> {capitalize(mac.diagnosticProps.id)}</Nowrap>
              </Pill>
            ))}
            <Spacer />
            <IconButton onClick={menu.handleClose()}>
              <TextIcon icon="Close" />
            </IconButton>
          </Flex>

          

          <Columns sx={{ alignItems: 'flex-start' }}>
            {!!selectedMachine && <Box sx={{
              height: 'calc(80vh - 10px)',
              overflow: 'auto'
            }}>
              <StateTree root state={selectedMachine.diagnosticProps} /> 
            </Box>}


            <AboutText selectMachine={selectMachine}/>
          
          </Columns>


        </Layout>
      </Drawer>
    </>
  );
};
AboutModal.defaultProps = {};
export default AboutModal;

const AboutText = ({ selectMachine }) => {
  return (
<Box sx={{mt: 2}}>
  <Nowrap variant="h5">About Boombot</Nowrap>
  <p><strong>Boombot</strong> is a dynamic web application built using the React framework and XState library. The app is designed to enable users to search for and play music tracks from iTunes. Boombot is composed of three state machines that control different aspects of the user interface: the <strong>Apple Search</strong> machine, the <strong>Audio Player</strong> machine, and the <strong>Simple Menu</strong> machine.</p>
  <p>One of the main advantages of XState is its ability to help developers manage complex state logic in a simple and intuitive way. This is particularly useful for applications like Boombot that require multiple state machines to be synchronized and coordinated in real-time. XState provides a powerful set of tools for modeling, validating, and visualizing state machines, which can help developers avoid common pitfalls and bugs.</p>
  <p>The <strong>Apple Search</strong> machine in Boombot is responsible for fetching music tracks from the iTunes API based on the user's search query. This machine is designed to handle various scenarios such as empty search queries, invalid responses, and network errors. The state machine can also trigger different UI components based on the state of the search process, such as displaying a loading spinner or an error message.</p>
  <p>The <strong>Audio Player</strong> machine controls the playback of music tracks in Boombot. This machine can handle various events such as playing, pausing, skipping, and seeking. The state machine can also trigger different UI components based on the state of the playback process, such as displaying a progress bar or a playlist.</p>
  <p>The <strong>Simple Menu</strong> machine controls the display and behavior of menus and modal components in Boombot. This machine can handle events such as opening, closing, and selecting menu items. The state machine can also trigger different UI components based on the state of the menu process, such as displaying a dropdown or a modal.</p>
  <p>Boombot leverages the benefits of React and XState to provide a seamless music playback experience for its users. The app's three state machines work together to provide robust functionality and handle various edge cases with ease. The use of XState in the application provides significant advantages in terms of state management, reducing complexity, and improving developer productivity. Overall, Boombot is a testament to the power and flexibility of modern web development tools and frameworks.</p>
</Box>


  )
}
