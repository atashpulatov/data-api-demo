import React from 'react';
import {shallow} from 'enzyme';
import {selectorProperties} from '../../src/attribute-selector/selector-properties';
import {popupController} from '../../src/popup/popup-controller';
import {officeContext} from '../../src/office/office-context';
import {ReportSubtypes} from '../../src/enums/ReportSubtypes';
import {officeDisplayService} from '../../src/office/office-display-service';
import {objectTypes} from 'mstr-react-library';
import {errorService} from '../../src/error/error-handler';

describe('PopupController', () => {
  const dialog = {};

  beforeAll(() => {
    dialog.close = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should handle update command from popup for cube',
      async () => {
      // given
        const actionObject = {
          command: selectorProperties.commandOnUpdate,
          reportId: 'reportId',
          projectId: 'projectId',
          reportSubtype: objectTypes.getTypeValues('Cube').subtype,
          body: {},
        };
        const arg = {
          message: JSON.stringify(actionObject),
        };
        const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
        // when
        await popupController.onMessageFromPopup(dialog, arg);
        // then
        expect(dialog.close).toBeCalled();
        expect(mockPrint).toBeCalled();
        expect(mockPrint).toBeCalledWith(actionObject.reportId,
            actionObject.projectId,
            false,
            null, null, null,
            actionObject.body);
      });

  it('should handle update command from popup for report',
      async () => {
      // given
        const actionObject = {
          command: selectorProperties.commandOnUpdate,
          reportId: 'reportId',
          projectId: 'projectId',
          reportSubtype: objectTypes.getTypeValues('Report').subtype,
          body: {},
        };
        const arg = {
          message: JSON.stringify(actionObject),
        };
        const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
        // when
        await popupController.onMessageFromPopup(dialog, arg);
        // then
        expect(dialog.close).toBeCalled();
        expect(mockPrint).toBeCalled();
        expect(mockPrint).toBeCalledWith(actionObject.reportId,
            actionObject.projectId,
            true,
            null, null, null,
            actionObject.body);
      });

  it('should handle error command from popup', () => {
    // given
    const command = selectorProperties.commandError;
    const error = {
      response: {
        status: 404,
      },
    };
    const expectedMessage = JSON.stringify({command, error});
    const givenArg = {
      message: expectedMessage,
    };

    jest.spyOn(errorService.handleError);
    // when
    popupController.onMessageFromPopup(dialog, givenArg);
    // then
    expect(false).toBeTruthy();
  });
});
