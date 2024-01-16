import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { reduxStore } from '../../store';
import { AttributeSelectorWindowNotConnected } from '../../attribute-selector/attribute-selector-window';
import { popupHelper } from '../../popup/popup-helper';

jest.mock('../../office/office-context');
jest.mock('../../popup/popup-helper');

describe('AttributeSelectorWindow', () => {
  it('should render attribute selector elements', () => {
    // given
    const mstrData = { chosenObjectType: 'report' };
    const chosenObject = { objectType: { name: 'dossier' } };
    // when
    // when
    const { getByText } = render(<Provider store={reduxStore}>
      <AttributeSelectorWindowNotConnected
        mstrData={mstrData}
        chosenObject={chosenObject}
      />
    </Provider>);
    // then
    getByText('Data Preview');
    getByText('Import Data');
    getByText('Cancel');
    getByText('MicroStrategy Data Connector');
  });

  it('should trigger handleBack when Back was clicked', () => {
    // given
    const handleBack = jest.fn();
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'
    };
    const chosenObject = { chosenObjectName: '55' };

    // when
    const { getByText } = render(<Provider store={reduxStore}>
      <AttributeSelectorWindowNotConnected
        mstrData={mstrData}
        chosenObject={chosenObject}
        handleBack={handleBack}
      />
    </Provider>);

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
      projectId: 'proId'
    };
    const chosenObject = { chosenObjectName: '55' };

    // when
    const { getByText } = render(<Provider store={reduxStore}>
      <AttributeSelectorWindowNotConnected
        mstrData={mstrData}
        chosenObject={chosenObject}
      />
    </Provider>);

    const officeMessageParentSpy = jest.spyOn(popupHelper, 'officeMessageParent');
    officeMessageParentSpy.mockClear();

    const cancelButton = getByText('Cancel');
    fireEvent.click(cancelButton);

    // then
    expect(officeMessageParentSpy).toHaveBeenCalledTimes(1);
  });
});
