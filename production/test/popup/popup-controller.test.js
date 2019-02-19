import React from 'react';
import {shallow} from 'enzyme';
import {selectorProperties} from '../../src/attribute-selector/selector-properties';
import {popupController} from '../../src/popup/popup-controller';
import {officeContext} from '../../src/office/office-context';
import {ReportSubtypes} from '../../src/enums/ReportSubtypes';
import {officeDisplayService} from '../../src/office/office-display-service';

describe('PopupController', () => {
  const oldDialog = {};
  const newDialog = {};
  const excelRun = jest.fn();

  beforeAll(() => {
    oldDialog.close = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should handle update command from popup',
      async () => {
        // given
        const actionObject = {
          command: selectorProperties.commandOnUpdate,
          reportId: 'reportId',
          reportSubtype: ReportSubtypes.cube,
          body: {},
        };
        const arg = {
          message: JSON.stringify(actionObject),
        };
        const mockPrint = jest.spyOn(officeDisplayService, 'printObject');
        // when
        await popupController.onMessageFromPopup(oldDialog, arg);
        // then
        expect(oldDialog.close).toBeCalled();
        expect(mockPrint).toBeCalled();
        expect(mockPrint).toBeCalledWith(actionObject.reportId, false, null, null, null, actionObject.body);
      });
});
