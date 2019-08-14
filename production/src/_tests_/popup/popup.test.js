import React from 'react';
import {shallow, mount} from 'enzyme';
import {Popup} from '../../popup/popup.jsx';
import {libraryErrorController} from 'mstr-react-library';
import {Office} from '../mockOffice';
import {officeContext} from '../../office/office-context.js';
import {selectorProperties} from '../../attribute-selector/selector-properties.js';
import {PopupTypeEnum} from '../../home/popup-type-enum.js';
import TouchFeedback from 'rmc-feedback';
import {_PopupViewSelector, PopupViewSelector} from '../../popup/popup-view-selector.jsx';

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
});
