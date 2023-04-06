import React from 'react';
import { Box, Card , Avatar, Popover, Stack} from '@mui/material';
// import { withAuthenticator } from '@aws-amplify/ui-react';
import {
  useAuthenticator ,
  useMenu
} from '../../../machines';
import {
  Nowrap,
  Flex,
  Spacer, 
  Btn, 
  FlexMenu,
  IconTextField,
  TinyButton,
  ConfirmPop
} from '../../../styled';
  

const LoginError = ({ handler }) => {
  const { error, stack } = handler;
  const events = handler.state.nextEvents.filter((f) => f !== 'CHANGE');

  return (
    <Stack sx={{ maxWidth: 240 }}>
      <Nowrap error>There was a problem with your sign in</Nowrap>
      <Nowrap>{error}</Nowrap>
      <Nowrap small>{stack}</Nowrap>
      <Box wrap sx={{ pt: 2 }} spacing={1}>
        {events.map((ev) => (
          <Btn variant="contained" onClick={() => handler.send(ev)}>
            {ev}
          </Btn>
        ))}
      </Box>
    </Stack>
  );
};


const LoginForm = ({ handler, onClose, fields }) => {
  const [ key ] = Object.keys(fields)
  if (!fields[key]) return <i />

  const {
    ok,
    label,
    button,
    ...data
  } = fields[key]


  const [...rest] = Object.keys(data);
  const handleChange = e => {
    handler.send({
      type: 'CHANGE',
      key: e.target.name,
      value: e.target.value
    })
  }

  const options = {
    FORGOT: 'Forgot password',
    CANCEL: 'Cancel',
    SIGNUP: 'Create account'
  }

  return (<>
    <Stack sx={{minWidth: 300}} spacing={1}>
      
      <Flex sx={{ pb: 2 }} spacing={1}>
      <TinyButton icon="Lock" />
      <Nowrap bold>{[label]}</Nowrap>
        <Spacer />
      <TinyButton icon="Close" onClick={onClose} />

      </Flex>

      {rest.map(field => <Stack key={field}>
       <Nowrap small> {fields[key][field]}</Nowrap>
        <IconTextField 
          size="small"
          fullWidth
          type={field === 'password' ? 'password' : 'text'}
          name={field}
          value={handler[field]}
          onChange={handleChange}
          placeholder={fields[key][field]}
        /> 
      </Stack>)}


      <Flex sx={{ p: theme => theme.spacing(1, 0, 2, 0) }}>
        <Spacer />
        <Btn onClick={() => handler.send(ok)} variant="contained">
        {button}  
        </Btn>
      </Flex>

      {handler.state.nextEvents.map(ev => !!options[ev] && <Nowrap 
        hover
        small
        muted
        onClick={() => handler.send(ev)}
        >
          {options[ev]}
      </Nowrap>)}

      {/* <Nowrap>

      {JSON.stringify(handler.state.value)} 
      </Nowrap>
      <Nowrap>
 
    {JSON.stringify(handler.state.nextEvents)}
      </Nowrap> */}
    </Stack>
  </>)
  
}
 
const Login = (props) => { 
  const auth = useAuthenticator();
  const menu = useMenu()

  if (auth.state.matches('send_signin')) {
    return <>Signing you in...</>
  }


  if (auth.state.matches('signed_in')) {
    return  <ConfirmPop  onChange={(ok) => ok &&  auth.send('SIGNOUT')}
      label="Confirm Logout"
      message="Are you sure you want to sign out?"
      ><Avatar 
    
      >{auth.user.username?.substr(0, 2).toUpperCase()}</Avatar></ConfirmPop>  
  }
 
 return (
   <>
   <Btn
      variant="contained"
      onClick={menu.handleClick}
    >
      Sign Up
    </Btn>
  <FlexMenu component={Popover}
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={menu.handleClose()}
      >

  <Card sx={{p:2}}>
    {!!auth.state.meta && <LoginForm onClose={menu.handleClose()} handler={auth} fields={auth.state.meta} />} 

    {!!auth.error && <LoginError handler={auth} />} </Card>
</FlexMenu>

   </>
 );
}
Login.defaultProps = {}; 


// export default withAuthenticator(Login);
export default Login