import React from 'react';
import {shallow, mount} from 'enzyme';
import {Popup} from '../../src/popup/popup.jsx';
import {libraryErrorController} from 'mstr-react-library';
import {Office} from '../mockOffice';
import {officeContext} from '../../src/office/office-context.js';
import {selectorProperties} from '../../src/attribute-selector/selector-properties.js';
import {PopupTypeEnum} from '../../src/home/popup-type-enum.js';
import TouchFeedback from 'rmc-feedback';
import {_PopupViewSelector, PopupViewSelector} from '../../src/popup/popup-view-selector.jsx';

describe('Popup.js', () => {
  const messageParentMock = jest.fn();
  beforeAll(() => {
    jest.spyOn(officeContext, 'getOffice')
        .mockReturnValue({
          context: {
            ui: {
              messageParent: messageParentMock,
            },
          },
        });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('should initialize error controller when constructed', () => {
    // given
    const location = {
      search: {},
    };
    // when
    shallow(<Popup location={location} />);
    // then
    expect(libraryErrorController.handleHttpError).not.toThrowError();
  });

  it('should message plugin when any error occurs', () => {
    // given
    const command = selectorProperties.commandError;
    const error = {
      response: {
        status: 404,
      },
    };
    const expectedMessage = JSON.stringify({command, error});
    const location = {
      search: {},
    };
    shallow(<Popup location={location} />);
    // when
    libraryErrorController.handleHttpError(error);
    // then
    expect(messageParentMock).toBeCalled();
    expect(messageParentMock).toBeCalledWith(expectedMessage);
  });

  it('should set projectId, reportId and subtype on handlePrepare', () => {
    // given
    const location = {
      search: {},
    };
    const givenRecord = {
      reportId: 'reportId',
      projectId: 'projectId',
      subtype: 'subtype',
    };
    const popupWrapped = shallow(<Popup location={location} />);
    // when
    popupWrapped.instance().handlePrepare(
        givenRecord.projectId,
        givenRecord.reportId,
        givenRecord.subtype
    );
    // then
    const mstrData = popupWrapped.state().mstrData;
    expect(mstrData.reportId).toEqual(givenRecord.reportId);
    expect(mstrData.projectId).toEqual(givenRecord.projectId);
    expect(mstrData.reportSubtype).toEqual(givenRecord.subtype);
    expect(mstrData.popupType).toEqual(PopupTypeEnum.dataPreparation);
  });

  it('should set projectId, reportId and subtype on handleBack', () => {
    // given
    const location = {
      search: {},
    };
    const givenRecord = {
      reportId: 'reportId',
      projectId: 'projectId',
      subtype: 'subtype',
    };
    const popupWrapped = shallow(<Popup location={location} />);
    // when
    popupWrapped.instance().handleBack(
        givenRecord.projectId,
        givenRecord.reportId,
        givenRecord.subtype
    );
    // then
    const mstrData = popupWrapped.state().mstrData;
    expect(mstrData.reportId).toEqual(givenRecord.reportId);
    expect(mstrData.projectId).toEqual(givenRecord.projectId);
    expect(mstrData.reportSubtype).toEqual(givenRecord.subtype);
  });

  it('should pass popupType on', () => {
    // given
    const location = {
      search: `popupType=${PopupTypeEnum.loadingPage}`,
    };
    // when
    const popupWrapped = shallow(<Popup location={location} />);
    // then
    const viewSelectorWrapped = popupWrapped.find(PopupViewSelector);
    expect(viewSelectorWrapped.prop('popupType')).toEqual(PopupTypeEnum.loadingPage);
  });

  it('should render nothing with incorrect type', () => {
    // given
    const location = {
      search: `popupType=wrongType`,
    };
    // when
    const popupWrapped = mount(<Popup location={location} />);
    // then
    const popupSelector = popupWrapped.find(_PopupViewSelector);
    expect(popupSelector.children().length).toBe(0);
  });
});
