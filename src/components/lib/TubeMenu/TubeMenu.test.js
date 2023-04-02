import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import TubeMenu from './TubeMenu';
 
afterEach(() => cleanup());
 
describe('<TubeMenu/>', () => {
 it('TubeMenu mounts without failing', () => {
   render(<TubeMenu />);
   expect(screen.getAllByTestId("test-for-TubeMenu").length).toBeGreaterThan(0);
 });
});

