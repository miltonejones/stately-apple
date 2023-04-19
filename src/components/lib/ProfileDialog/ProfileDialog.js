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
  MenuItem,
  LinearProgress,
  Slider, 
} from '@mui/material';
 
import { Auth, Storage } from 'aws-amplify';
import { TextIcon, Flex, Nowrap, Spacer, Columns, Btn, HiddenUpload } from '../../../styled';
import { DJ_OPTIONS, useListImport }  from '../../../machines';
import moment from "moment";


const demoLanguages = { 
  Danish: 'da-DK',
  Dutch: 'nl-NL',
  English: 'en-US',
  French: 'fr-FR',
  German: 'de-DE', 
  Italian: 'it-IT',
  Japanese: 'ja-JP', 
  'Portuguese (Portugal, Brazil)': 'pt-PT', 
  Spanish: 'es-ES',
};

const synth = window.speechSynthesis;
const voices = synth.getVoices();

const ProfileDialog = ({ user, onChange, tube }) => { 

  // state variables for form fields
  const [firstName, setFirstName] = useState(user.attributes.given_name);
  const [lastName, setLastName] = useState(user.attributes.family_name);
  const [email, setEmail] = useState(user.attributes.email);
  const [locale, setLocale] = useState(user.attributes.locale || 'en-US');
  const [photoUrl, setPhotoUrl] = useState(user.attributes.picture);
  const [value, setValue] = useState(0);

  const importer = useListImport()


  const [ language ] = locale.split('-');


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
      locale,
      picture: photoUrl,
    });  
    onChange && onChange(photoUrl) 
  };

  const djProps = {
    // [DJ_OPTIONS.OFF]: 'Turn off the DJ',
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

// Handle batch download of selected items.
const handleBatch = () => {
  const batch = importer.results?.map((item) => ({
    ...item,
    param: `${item.trackName} ${item.artistName}`,
    playlists: [importer.listname]
  }));
  tube.send({
    type: 'BATCH',
    batch,
    slow: importer.slow
  }); 
};

  const tubeBusy = tube.state.matches('batch_lookup')

  // const availableVoices = voices?.filter(voice => !!voice.localService && voice.lang.indexOf(language) > -1);

  // console.log({
  //   availableVoices
  // })
  return (
    <div> 
       <Tabs value={value} onChange={handleChange}>
        <Tab label="Profile" />
        <Tab disabled={!tube?.user} label="DJ Control" />
        <Tab disabled={!tube?.user} label="Import" />
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

      {value === 2 && <Stack spacing={1}>
        
        
            <HiddenUpload
              onChange={(obj) => {
                // alert(JSON.stringify(obj))

                const ev = obj.filter(f => !tube.pins.find(p => p.param === `${f.trackName} ${f.artistName}`))


                importer.send({
                  type: 'LOAD',
                  tracks: ev
                }) 
              }}
            >
              Import sky-tunes playlist...
            </HiddenUpload>
              {JSON.stringify(tube.state.value)}--
              {JSON.stringify(importer.state.value)}--
              {JSON.stringify(tube.remainingTime)}--


             {!!tube.batch_progress && <LinearProgress variant="determinate" value={tube.batch_progress} />}

              <Columns columns="1fr 1fr 1fr 1fr">
              {importer.results?.map(res => (
                <Stack>
                  <Nowrap sx={{ maxWidth: 200 }} bold={res.param === tube.param} small>{res?.trackName}</Nowrap>
                  <Nowrap sx={{ maxWidth: 200 }}  tiny muted>{res?.artistName}</Nowrap>
                </Stack>
              ))}</Columns>


             {importer.state.matches('verify') && <Flex spacing={1}>


                <Flex 
                 
                  onClick={e => {
                      importer.send({
                        type: 'CHANGE',
                        key:'slow',
                        value:!importer.slow
                      }) 
                  }}>
                <Switch checked={!importer.slow}  />
                <Nowrap small>Use API</Nowrap>
                </Flex>


                <TextField
                  name="listname"
                  disabled={tubeBusy}
                  value={importer.listname}
                  size="small"
                  onChange={e => {
                      importer.send({
                        type: 'CHANGE',
                        key: e.target.name,
                        value: e.target.value
                      }) 
                  }}
                
                />
              <Spacer />
             <Btn 
              variant="contained"
              disabled={tubeBusy || !importer.listname}
              onClick={handleBatch}>import</Btn>
              
              </Flex>}
        </Stack>}

       {value === 0 && <form onSubmit={handleSubmit} >
          <Stack sx={{ m: 1 }} spacing={2}>
            <TextField
              size="small"
              label="First Name" 
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              size="small"
              label="Language" 
              value={locale}
              select 
              onChange={(e) => setLocale(e.target.value)}
            >
             {Object.keys(demoLanguages).map(key =>  <MenuItem key={key} value={demoLanguages[key]}>{key}</MenuItem>)}
            </TextField>

            <Flex>

            <Button variant="contained" color="primary" type="submit">
              Update Profile
            </Button>
            </Flex>

          </Stack>

        </form> }

      {value === 1 && <Stack sx={{
        minWidth: 400,
        p: 2
      }}>


         <Nowrap bold small>
          DJ announcer frequency
         </Nowrap>
         <Flex spacing={2}>
          <Slider 
             value={tube.cadence}
             onChange={(_, value) => { 
              tube.send({
                type: 'CHANGE',
                key: 'cadence',
                value 
              })  
             }}
             min={0}
             max={1}
             step={0.01}
          />
         <Nowrap wrap small muted cap>
          {tube.cadence === 1 
            ? 'always'
            : tube.cadence === 0
            ? 'never'
            : tube.cadence > 0.75
            ? 'often'
            : tube.cadence < 0.25
            ? 'seldom'
            : 'sometimes'}
         </Nowrap>

         </Flex>
            <Divider sx={{ m: theme => theme.spacing(2, 0) }} />

         <Nowrap small bold cap>
         announcer content settings 
         </Nowrap>
         {Object.keys(djProps).map(key => <Flex 
            onClick={() => handleDJ(key)}
            key={key}>
          <Switch 
            disabled={ key === DJ_OPTIONS.BOOMBOT || (key !== DJ_OPTIONS.OFF && !!(tube.options & DJ_OPTIONS.OFF))}
            checked={!!(tube.options & key)} />
          <Nowrap small muted={key === DJ_OPTIONS.BOOMBOT}>
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