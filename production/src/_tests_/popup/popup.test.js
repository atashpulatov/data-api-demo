import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { libraryErrorController } from '@mstr/mstr-react-library';
import { Popup } from '../../popup/popup.jsx';
import { reduxStore } from '../../store';
import { officeContext } from '../../office/office-context.js';
import { selectorProperties } from '../../attribute-selector/selector-properties.js';
import { PopupTypeEnum } from '../../home/popup-type-enum.js';
import { PopupViewSelectorNotConnected, PopupViewSelector } from '../../popup/popup-view-selector.jsx';
import { Office } from '../mockOffice';


describe.skip('Popup.js', () => {
  const messageParentMock = jest.fn();
  beforeAll(() => {
    jest.spyOn(officeContext, 'getOffice')
      .mockReturnValue({ context: { ui: { messageParent: messageParentMock, }, }, });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('should initialize error controller when constructed', () => {
    // given
    const location = { search: {} };
    // when
    shallow(<Popup location={location} />);
    // then
    expect(libraryErrorController.handleHttpError).not.toThrowError();
  });

  it('should message plugin when any error occurs', () => {
    // given
    const command = selectorProperties.commandError;
    const error = { response: { status: 404, }, };
    const expectedMessage = JSON.stringify({ command, error });
    const location = { search: {}, };
    shallow(<Popup location={location} />);
    // when
    libraryErrorController.handleHttpError(error);
    // then
    expect(messageParentMock).toBeCalled();
    expect(messageParentMock).toBeCalledWith(expectedMessage);
  });

  it('should set projectId, chosenObjectId and subtype on handlePrepare', () => {
    // given
    const location = { search: {}, };
    const givenRecord = {
      chosenObjectId: 'chosenObjectId',
      projectId: 'projectId',
      subtype: 'subtype',
    };
    const popupWrapped = shallow(<Popup location={location} />);
    // when
    popupWrapped.instance().handlePrepare(
      givenRecord.projectId,
      givenRecord.chosenObjectId,
      givenRecord.subtype
    );
    // then
    const { mstrData } = popupWrapped.state();
    expect(mstrData.chosenObjectId).toEqual(givenRecord.chosenObjectId);
    expect(mstrData.projectId).toEqual(givenRecord.projectId);
    expect(mstrData.chosenObjectSubtype).toEqual(givenRecord.subtype);
    expect(mstrData.popupType).toEqual(PopupTypeEnum.dataPreparation);
  });

  it('should set projectId, chosenObjectId and subtype on handleBack', () => {
    // given
    const location = { search: {}, };
    const givenRecord = {
      chosenObjectId: 'chosenObjectId',
      projectId: 'projectId',
      subtype: 'subtype',
    };
    const popupWrapped = shallow(<Popup location={location} />);
    // when
    popupWrapped.instance().handleBack(
      givenRecord.projectId,
      givenRecord.chosenObjectId,
      givenRecord.subtype
    );
    // then
    const { mstrData } = popupWrapped.state();
    expect(mstrData.chosenObjectId).toEqual(givenRecord.chosenObjectId);
    expect(mstrData.projectId).toEqual(givenRecord.projectId);
    expect(mstrData.chosenObjectSubtype).toEqual(givenRecord.subtype);
  });

  it('should pass popupType on', () => {
    // given
    const location = { search: `popupType=${PopupTypeEnum.loadingPage}`, };
    // when
    const popupWrapped = shallow(<Popup location={location} />);
    // then
    const viewSelectorWrapped = popupWrapped.find(PopupViewSelector);
    expect(viewSelectorWrapped.prop('popupType')).toEqual(PopupTypeEnum.loadingPage);
  });

  it('should render nothing with incorrect type', () => {
    // given
    const location = { search: `popupType=wrongType`, };
    // when
    const popupWrapped = mount(
      <Provider store={reduxStore}>
        <Popup location={location} />
      </Provider>
    );
    // then
    const popupSelector = popupWrapped.find(PopupViewSelectorNotConnected);
    expect(popupSelector.children()).toHaveLength(0);
  });
});
