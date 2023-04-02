import React from 'react';
import TubeDrawer from './TubeDrawer';
 
export default {
 title: 'TubeDrawer',
 component: TubeDrawer
};
 
const Template = (args) => <TubeDrawer {...args} />;
export const DefaultView = Template.bind({});
DefaultView.args = {};
