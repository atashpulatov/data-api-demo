// TODO: Rewrite tests
/* eslint-disable jest/no-disabled-tests */
import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { fireEvent, render } from '@testing-library/react';
import { reduxStore } from '../../store';
import { AttributeSelectorWindowNotConnected } from '../../attribute-selector/attribute-selector-window';
import { AttributeSelector } from '../../attribute-selector/attribute-selector';
import { popupHelper } from '../../popup/popup-helper';

jest.mock('../../office/office-context');
jest.mock('../../popup/popup-helper');

describe('AttributeSelectorWindow', () => {
  it('should contain attribute selector', () => {
    // given
    const mstrData = { chosenObjectType: 'report' };
    const chosenObject = { objectType: { name: 'dossier' } };
    const displayLanguageMock = 'en-US';
    // when
    const componentWrapper = mount(
      <Provider store={reduxStore}>
        <AttributeSelectorWindowNotConnected
          mstrData={mstrData}
          chosenObject={chosenObject}
        />
      </Provider>
    );
    // then
    const selectorWrapper = componentWrapper.find(AttributeSelector);
    expect(selectorWrapper.get(0)).toBeDefined();
  });

  it('should pass mstr data', () => {
    // given
    const mstrData = {
      chosenObjectId: 'id',
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'
    };
    const chosenObject = {
      promptsAnswers: 'promptsAnswers',
      mstrObjectType: { name: 'dossier' }
    };
    const objectName = '55';
    // when
    const componentWrapper = shallow(<AttributeSelectorWindowNotConnected
      mstrData={mstrData}
      chosenObject={chosenObject}
      objectName={objectName}
    />);
    // then
    const selectorWrapped = componentWrapper.find(AttributeSelector).at(0);
    expect(selectorWrapped.prop('mstrData')).not.toBeDefined();
    expect(selectorWrapped.prop('session')).not.toBeDefined();
    expect(selectorWrapped.prop('title')).toEqual(`Import Dossier > 55`);
    expect(selectorWrapped.prop('chosenObjectId')).not.toBeDefined();
    expect(selectorWrapped.prop('chosenObjectSubtype')).not.toBeDefined();
  });

  it.skip('should trigger handleCancel when Cancel was clicked', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'
    };
    const chosenObject = {
      chosenObjectName: '55',
      promptsAnswers: 'promptsAnswers',
      objectType: { name: 'dossier' }
    };
    // when
    const componentWrapper = mount(<Provider store={reduxStore}>
      <AttributeSelectorWindowNotConnected
        mstrData={mstrData}
        chosenObject={chosenObject}
      />
    </Provider>);
    const spyMethod = jest.spyOn(popupHelper, 'officeMessageParent');
    const wrappedCancelButton = componentWrapper.find('Button #cancel');
    wrappedCancelButton.simulate('click');

    // then
    expect(spyMethod).toBeCalled();
  });

  it.skip('should trigger handleBack when Back was clicked', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId',
      chosenObjectId: 'repId',
      chosenObjectType: 'report',
    };
    const chosenObject = { chosenObjectName: '55' };
    const handleBack = jest.fn();
    // when
    const componentWrapper = mount(
      <Provider store={reduxStore}>
        <AttributeSelectorWindowNotConnected
          mstrData={mstrData}
          chosenObject={chosenObject}
          handleBack={handleBack}
        />
      </Provider>
    );
    const wrappedCancelButton = componentWrapper.find('Button #back');
    wrappedCancelButton.simulate('click');

    // then
    expect(handleBack).toBeCalled();
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
