import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import MediaMenu from './MediaMenu';
 
afterEach(() => cleanup());
 
describe('<MediaMenu/>', () => {
 it('MediaMenu mounts without failing', () => {
   render(<MediaMenu />);
   expect(screen.getAllByTestId("test-for-MediaMenu").length).toBeGreaterThan(0);
 });
});

