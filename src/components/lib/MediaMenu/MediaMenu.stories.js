import React from 'react';
import MediaMenu from './MediaMenu';
 
export default {
 title: 'MediaMenu',
 component: MediaMenu
};
 
const Template = (args) => <MediaMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
