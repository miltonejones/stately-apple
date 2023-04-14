/**
 * Renders track details component
 * @param {Object} props - props object
 * @param {Object} props.handler - track detail handler object
 * @returns {JSX.Element} - track details component
 */
 import React from 'react';
 import { Switch, Stack } from '@mui/material';
 import { Nowrap, TinyButton, Flex } from '../../../../../styled';
 
 const TrackDetails = ({ handler }) => {
   const { trackName, collectionName, artistName, repeat } = handler;
 
   const handleToggleRepeat = () => {
     handler.send({
       type: 'TOGGLE',
       key: 'repeat'
     });
   };
 
   const handleClose = () => {
     handler.send('CLOSE');
   };
 
   return (
     <Stack>
       <Nowrap>{trackName}</Nowrap>
       <Nowrap small muted>{collectionName}</Nowrap>
       <Nowrap small muted>{artistName}</Nowrap>
       <Flex>
         <Switch
           size="small"
           checked={repeat}
         />
         <Nowrap
           small
           muted
           bold={repeat}
           hover
           onClick={handleToggleRepeat}
         >
           Continuous Play
         </Nowrap>
         <TinyButton
           icon="Close"
           onClick={handleClose}
         />
       </Flex>
     </Stack>
   );
 };
 
 TrackDetails.defaultProps = {
   handler: {}
 };
 
 export default TrackDetails;

 