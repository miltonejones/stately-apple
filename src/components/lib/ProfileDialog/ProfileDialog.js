/**
 * Component that allows Cognito users to update their profile information including first and last name,
 * email address, and profile photo using AWS Amplify.
 *
 * @component
 */

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Avatar,  
  Stack,
  Tabs,
  Tab,
  Switch,
  Divider,
} from '@mui/material';
 
import { Auth, Storage } from 'aws-amplify';
import { TextIcon, Flex, Nowrap } from '../../../styled';
import { DJ_OPTIONS }  from '../../../machines';


 

const ProfileDialog = ({ user, onChange, tube }) => { 

  // state variables for form fields
  const [firstName, setFirstName] = useState(user.attributes.given_name);
  const [lastName, setLastName] = useState(user.attributes.family_name);
  const [email, setEmail] = useState(user.attributes.email);
  const [photoUrl, setPhotoUrl] = useState(user.attributes.picture);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // method to handle file selection for photo input
  const handlePhotoSelection = async (e) => {
    const file = e.target.files[0];
    const key = `public/${user.username}/${file.name}`;

    try {
      // uploads file to S3 bucket
      await Storage.put(key, file, { contentType: file.type });

      // sets photoUrl state variable to display uploaded photo
      const photoUrl = await Storage.get(key);
      setPhotoUrl(photoUrl);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  // method to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // updates user attributes in Cognito
    await Auth.updateUserAttributes(user, {
      given_name: firstName,
      family_name: lastName,
      email: email,
      picture: photoUrl,
    });  
    onChange && onChange(photoUrl) 
  };

  const djProps = {
    [DJ_OPTIONS.OFF]: 'Turn off the DJ',
    [DJ_OPTIONS.USERNAME]: 'Say the logged in users name',
    [DJ_OPTIONS.TIME]: 'Mention the time',
    [DJ_OPTIONS.UPNEXT]: 'Talk about upcoming tracks',
    [DJ_OPTIONS.RANDOM]: 'Randomize DJ voices',
    [DJ_OPTIONS.SHOW]: 'Show DJ text on screen',
    [DJ_OPTIONS.BOOMBOT]: 'Say station name',
  }

  const handleDJ = (key) => {
    tube.send({
      type: 'CHANGE',
      key: 'options',
      value: tube.options & key 
        ? tube.options - key 
        : tube.options + Number(key)
    })
  }

  return (
    <div> 
       <Tabs value={value} onChange={handleChange}>
        <Tab label="Profile" />
        <Tab disabled={!tube?.user} label="DJ Control" />
      </Tabs>
      
      {value === 0 && <>
        <Flex spacing={1} sx={{ m: 1 }}>
            <Avatar 
              alt={`${user.attributes.given_name} ${user.attributes.family_name}`}
              src={photoUrl}
            />
            <label htmlFor="photo-input">
              <input
                accept="image/*" 
                id="photo-input"
                type="file"
                onChange={handlePhotoSelection}
              />
            </label>

        </Flex>
        <Flex sx={{ m: 1 }}>

        <Button 
          variant="contained"
          color="primary"
          startIcon={<TextIcon icon="PhotoCamera" />}
          component="span"
        >
          Upload Photo
        </Button>

        </Flex>
        <Divider sx={{ m: 2 }} />
      </>}

       {value === 0 && <form onSubmit={handleSubmit} >
          <Stack sx={{ m: 1 }} spacing={1}>
            <TextField
              size="small"
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              size="small"
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              size="small"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Flex>

            <Button variant="contained" color="primary" type="submit">
              Update Profile
            </Button>
            </Flex>

          </Stack>

        </form> }

      {value === 1 && <Stack>
         {Object.keys(djProps).map(key => <Flex 
            onClick={() => handleDJ(key)}
            key={key}>
          <Switch 
            disabled={ key !== DJ_OPTIONS.OFF && !!(tube.options & DJ_OPTIONS.OFF)}
            checked={!!(tube.options & key)} />
          <Nowrap small>
            {djProps[key]}
          </Nowrap>
         </Flex>)}
        </Stack>}
      
    </div>
  );
};

export default ProfileDialog;

/*
  - This component allows Cognito users to update their profile information including first and last name,
    email address, and profile photo using AWS Amplify.

  - The component uses Material-UI components for styling and icons. The form includes text fields for first and
    last name, email address, and a file input for the profile photo, along with a button to upload the photo.

  - The component also integrates the Amplify Storage class to upload and retrieve the user's profile photo from an S3 bucket.

  - Upon form submission, the component updates the user's attributes in Cognito, including the newly uploaded profile photo.
*/