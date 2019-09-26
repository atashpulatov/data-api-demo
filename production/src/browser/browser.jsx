import React from 'react';
import { ObjectTable } from '@mstr/rc';
import { PopupButtons } from '../popup/popup-buttons';
import { reportsExample } from './objects';
import { projectsExample } from './projects';

export const Browser = (props) => {
  // TODO: replace the storybook code snippets below
  const objects = reportsExample.result;
  const projects = projectsExample;
  console.log({ objects });
  return (
    <>
      <ObjectTable
        objects={objects}
        projects={projects}
        sort={{
          sortBy: 'dateModified',
          sortDirection: 'DESC',
        }}
        onSortChange={(data) => console.log(data)}
        selected={{
          id: '02DDEFDA460B58681B005AAB4A1CBFD3',
          projectId: 'CE52831411E696C8BD2F0080EFD5AF44',
        }}
        onSelect={(data) => console.log(data)}
        locale="en-US"
        filter={{}}
        myLibrary={false}
      />
      <PopupButtons />
    </>
  );
};

export default Browser;
