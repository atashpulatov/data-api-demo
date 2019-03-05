import React from 'react';
import {shallow} from 'enzyme';
import {Popup} from '../../src/popup/popup.jsx';
import {libraryErrorController} from 'mstr-react-library';
import {officeContext} from '../../src/office/office-context.js';
import {selectorProperties} from '../../src/attribute-selector/selector-properties.js';
import {EnvironmentNotFoundError} from '../../src/error/environment-not-found-error.js';

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
    const parsed = popupWrapped.state().parsed;
    expect(parsed.reportId).toEqual(givenRecord.reportId);
    expect(parsed.projectId).toEqual(givenRecord.projectId);
    expect(parsed.reportSubtype).toEqual(givenRecord.subtype);
  });
});
