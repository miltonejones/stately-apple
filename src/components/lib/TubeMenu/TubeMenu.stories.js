import React from 'react';
import TubeMenu from './TubeMenu';
 
export default {
 title: 'TubeMenu',
 component: TubeMenu
};
 
const Template = (args) => <TubeMenu {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
