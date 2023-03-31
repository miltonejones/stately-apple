import React from 'react';
import AudioPlayer from './AudioPlayer';
 
export default {
 title: 'AudioPlayer',
 component: AudioPlayer
};
 
const Template = (args) => <AudioPlayer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
