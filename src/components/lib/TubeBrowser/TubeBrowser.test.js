import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import TubeBrowser from './TubeBrowser';
 
afterEach(() => cleanup());
 
describe('<TubeBrowser/>', () => {
 it('TubeBrowser mounts without failing', () => {
   render(<TubeBrowser />);
   expect(screen.getAllByTestId("test-for-TubeBrowser").length).toBeGreaterThan(0);
 });
});

