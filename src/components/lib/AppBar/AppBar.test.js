import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AppBar from './AppBar';
 
afterEach(() => cleanup());
 
describe('<AppBar/>', () => {
 it('AppBar mounts without failing', () => {
   render(<AppBar />);
   expect(screen.getAllByTestId("test-for-AppBar").length).toBeGreaterThan(0);
 });
});

