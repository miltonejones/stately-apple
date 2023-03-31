import React from 'react';
import AppBar from './AppBar';
 
export default {
 title: 'AppBar',
 component: AppBar
};
 
const Template = (args) => <AppBar {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
