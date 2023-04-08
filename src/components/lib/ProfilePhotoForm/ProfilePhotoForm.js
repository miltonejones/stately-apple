import React from 'react'; 

import { TextPopover, Nowrap, Flex } from '../../../styled';
import { AuthContext } from '../../../machines';

function ProfilePhotoForm({ currentPhoto, onPhotoChange }) {
  const { authenticator } = React.useContext(AuthContext);

  return (
    <TextPopover
      label="Set profile photo"
      name="photo"
      description={
        <Flex spacing={1}>
          {!!authenticator.user?.attributes.picture && (
            <img
              src={authenticator.user.attributes.picture}
              alt={authenticator.user.username}
              style={{ width: 40, borderRadius: '50%' }}
            />
          )}
          Enter or paste the URL for your new photo
        </Flex>
      }
      onChange={(file) => !!file && authenticator.setPhoto(file.target.value)}
    >
      <Nowrap small hover>
        Set profile photo
      </Nowrap>
    </TextPopover>
  );
}

export default ProfilePhotoForm;
