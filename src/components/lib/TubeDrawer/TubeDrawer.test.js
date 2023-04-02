import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import TubeDrawer from './TubeDrawer';
 
afterEach(() => cleanup());
 
describe('<TubeDrawer/>', () => {
 it('TubeDrawer mounts without failing', () => {
   render(<TubeDrawer />);
   expect(screen.getAllByTestId("test-for-TubeDrawer").length).toBeGreaterThan(0);
 });
});

