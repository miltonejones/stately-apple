import React from 'react';
import HomeBar from './HomeBar';
 
export default {
 title: 'HomeBar',
 component: HomeBar
};
 
const Template = (args) => <HomeBar {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
