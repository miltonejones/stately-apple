import React from 'react';
import TubeBrowser from './TubeBrowser';
 
export default {
 title: 'TubeBrowser',
 component: TubeBrowser
};
 
const Template = (args) => <TubeBrowser {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
