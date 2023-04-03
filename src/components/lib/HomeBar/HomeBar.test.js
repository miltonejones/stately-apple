import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import HomeBar from './HomeBar';
 
afterEach(() => cleanup());
 
describe('<HomeBar/>', () => {
 it('HomeBar mounts without failing', () => {
   render(<HomeBar />);
   expect(screen.getAllByTestId("test-for-HomeBar").length).toBeGreaterThan(0);
 });
});

