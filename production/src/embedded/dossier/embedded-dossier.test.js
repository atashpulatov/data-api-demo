import React from 'react';
import { createRoot } from 'react-dom';

import { EmbeddedDossier } from './embedded-dossier';

describe('EmbeddedDossierNotConnected', () => {
  let container = null;
  let root = null;

  beforeEach(() => {
    // Set up a DOM element as a render target
    container = document.createElement('div');
    root = createRoot(container);
  });

  afterEach(() => {
    // Clean up on exiting
    container.remove();
  });

  it('renders without crashing', () => {
    root.render(<EmbeddedDossier />, container);
  });

  // Add more tests for other component methods and functionalities
});
