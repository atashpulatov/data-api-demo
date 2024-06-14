import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';

import { dialogHelper } from '../dialog/dialog-helper';

import { reduxStore } from '../store';

import { AttributeSelectorWindowNotConnected } from './attribute-selector-window';
import { ObjectImportType } from '../mstr-object/constants';

jest.mock('../office/office-context');
jest.mock('../dialog/dialog-helper');

describe('AttributeSelectorWindow', () => {
  it('should render attribute selector elements', () => {
    // given
    const mstrData = { chosenObjectType: 'report' };
    const chosenObject = { objectType: { name: 'dossier' } };
    const editedObject = { editedObjectImportType: ObjectImportType.TABLE };

    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <AttributeSelectorWindowNotConnected
          mstrData={mstrData}
          chosenObject={chosenObject}
          editedObject={editedObject}
        />
      </Provider>
    );

    // then
    getByText('Data Preview');
    getByText('Import');
    getByText('Cancel');
    getByText('MicroStrategy Data Connector');
  });

  it('should trigger handleBack when Back was clicked', () => {
    // given
    const handleBack = jest.fn();
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId',
    };
    const chosenObject = { chosenObjectName: '55' };
    const editedObject = { editedObjectImportType: ObjectImportType.TABLE };

    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <AttributeSelectorWindowNotConnected
          mstrData={mstrData}
          chosenObject={chosenObject}
          handleBack={handleBack}
          editedObject={editedObject}
        />
      </Provider>
    );

    const backButton = getByText('Back');
    fireEvent.click(backButton);

    // then
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('should trigger attribute-selector-helpers: officeMessageParent when Cancel is clicked', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId',
    };
    const chosenObject = { chosenObjectName: '55' };
    const editedObject = { editedObjectImportType: ObjectImportType.TABLE };

    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <AttributeSelectorWindowNotConnected
          mstrData={mstrData}
          chosenObject={chosenObject}
          editedObject={editedObject}
        />
      </Provider>
    );

    const officeMessageParentSpy = jest.spyOn(dialogHelper, 'officeMessageParent');
    officeMessageParentSpy.mockClear();

    const cancelButton = getByText('Cancel');
    fireEvent.click(cancelButton);

    // then
    expect(officeMessageParentSpy).toHaveBeenCalledTimes(1);
  });
});
