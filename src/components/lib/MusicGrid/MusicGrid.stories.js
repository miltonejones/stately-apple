import React from 'react';
import MusicGrid from './MusicGrid';
 
export default {
 title: 'MusicGrid',
 component: MusicGrid
};
 
const Template = (args) => <MusicGrid {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
