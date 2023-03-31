import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import MusicGrid from './MusicGrid';
 
afterEach(() => cleanup());
 
describe('<MusicGrid/>', () => {
 it('MusicGrid mounts without failing', () => {
   render(<MusicGrid />);
   expect(screen.getAllByTestId("test-for-MusicGrid").length).toBeGreaterThan(0);
 });
});

