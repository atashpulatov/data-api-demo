import React from 'react';
import { ObjectTable } from '@mstr/rc';
import { PopupButtons } from '../popup/popup-buttons';
import { reportsExample } from './objects';
import { projectsExample } from './projects';

export const Browser = (props) => {
  console.log('');  // TODO: replace with story code for test
  const objects = reportsExample.result;
  const projects = projectsExample;
  console.log(objects);
  return (
    <div>
      <ObjectTable objects={objects} projects={projects} sort={{}} />
      <PopupButtons />
    </div>
  );
};

export default Browser;
