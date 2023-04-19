import React from 'react';
import { styled, Box, Dialog, Card, MenuItem, Avatar, Popover, Stack } from '@mui/material';
import { AuthContext, useMenu } from '../../../machines';
import {
  Nowrap,
  Flex,
  Spacer,
  Btn,
  FlexMenu,
  IconTextField,
  TextIcon,
  TinyButton,
  // ConfirmPop,
} from '../../../styled';
import ProfileDialog from '../ProfileDialog/ProfileDialog';

const Photo = styled(({ children, ...props }) => (
  <Avatar {...props}>{children}</Avatar>
))(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    outline: 'solid 2px ' + theme.palette.primary.main,
    outlineOffset: 2,
  },
}));

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

const LoginForm = ({ handler, onClose }) => {
  const fields = handler.state.meta;
  const [key] = Object.keys(fields);
  if (!fields[key]) return <i />;

  const { ok, label, button, ...data } = fields[key];

  const fieldProps = Object.keys(data);

  const handleChange = (e) => {
    handler.send({
      type: 'CHANGE',
      key: e.target.name,
      value: e.target.value,
    });
  };

  // next actions based on state.nextEvents array
  const options = {
    FORGOT: 'Forgot password',
    CANCEL: 'Cancel',
    SIGNUP: 'Create account',
  };

  return (
    <>
      <Stack sx={{ minWidth: 300 }} spacing={1}>
        {/* login form header  */}
        <Flex sx={{ pb: 2 }} spacing={1}>
          <TinyButton icon="Lock" />
          <Nowrap bold>{[label]}</Nowrap>
          <Spacer />
          <TinyButton icon="Close" onClick={onClose} />
        </Flex>

        {/* loop over state meta object to render fields  */}
        {fieldProps.map((field) => (
          <Stack key={field}>
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
          </Stack>
        ))}

        <Flex sx={{ p: (theme) => theme.spacing(1, 0, 2, 0) }}>
          <Spacer />
          <Btn onClick={() => handler.send(ok)} variant="contained">
            {button}
          </Btn>
        </Flex>

        {handler.state.nextEvents.map(
          (ev) =>
            !!options[ev] && (
              <Nowrap hover small muted onClick={() => handler.send(ev)}>
                {options[ev]}
              </Nowrap>
            )
        )}
      </Stack>
    </>
  );
};

const Login = ({ children, ...props }) => {
  const { authenticator } = React.useContext(AuthContext);
  const modal = useMenu();

  const menu = useMenu(val => {
    val === 2 && modal.handleClick()
  });

  if (authenticator.state.matches('send_signin')) {
    return <>Wait...</>;
  }

  if (authenticator.state.matches('signed_in')) {
    return (
      <>

      <FlexMenu
        component={Dialog}
        open={Boolean(modal.open)}
        onClose={modal.handleClose()}
        maxWidth="lg"
     > 
      <Box sx={{ p: 2 }}>
      <ProfileDialog user={authenticator.user} onChange={modal.handleClose()} tube={props.tube}/>
      </Box>
      </FlexMenu>



      <FlexMenu
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={menu.handleClose()}
     >
        <MenuItem onClick={menu.handleClose(1)} >Log out</MenuItem>
        <MenuItem  onClick={menu.handleClose(2)} >Edit Profile</MenuItem>

      </FlexMenu>


      <Box onClick={menu.handleClick}>
        {!children ? (
        <>  <Photo
            src={authenticator.user.attributes.picture}
            alt={authenticator.user.username}
          >
            {authenticator.user.username?.substr(0, 2).toUpperCase()}
          </Photo>
        
          </>
        ) : (
          <>{children}</>
        )}
      </Box>

 
      </>
    );
  }

  return (
    <>
      {!children ? (
        <Photo size="small" onClick={menu.handleClick}>
          <TextIcon icon="Lock" />
        </Photo>
      ) : (
        <Box onClick={menu.handleClick}>{children}</Box>
      )}

      <FlexMenu
        component={Popover}
        anchorEl={menu.anchorEl}
        open={Boolean(menu.anchorEl)}
        onClose={menu.handleClose()}
      >
        <Card sx={{ p: 2 }}>
          {!!authenticator.state.meta && (
            <LoginForm onClose={menu.handleClose()} handler={authenticator} />
          )}
          {!!authenticator.error && <LoginError handler={authenticator} />}
        </Card>
      </FlexMenu>
    </>
  );
};
Login.defaultProps = {};

export default Login;
