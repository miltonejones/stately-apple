import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import AudioPlayer from './AudioPlayer';
 
afterEach(() => cleanup());
 
describe('<AudioPlayer/>', () => {
 it('AudioPlayer mounts without failing', () => {
   render(<AudioPlayer />);
   expect(screen.getAllByTestId("test-for-AudioPlayer").length).toBeGreaterThan(0);
 });
});

