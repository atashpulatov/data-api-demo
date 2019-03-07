import {selectorProperties} from '../../src/attribute-selector/selector-properties';
import {popupController} from '../../src/popup/popup-controller';
import {officeDisplayService} from '../../src/office/office-display-service';
import {objectTypes} from 'mstr-react-library';
import {errorService} from '../../src/error/error-handler';
import {EnvironmentNotFoundError} from '../../src/error/environment-not-found-error';
import {PopupTypeEnum} from '../../src/home/popup-type-enum';

describe('PopupController', () => {
  const dialog = {};

  beforeAll(() => {
    dialog.close = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should run popup with proper settings when called for navigation', () => {
    // given
    const popupType = PopupTypeEnum.navigationTree;
    const size = 80;
    const runPopupSpy = jest.spyOn(popupController, 'runPopup').mockImplementationOnce(()=>{});
    // when
    popupController.runPopupNavigation();
    // then
    expect(runPopupSpy).toBeCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size);
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

    const handleErrorSpy = jest.spyOn(errorService, 'handleError')
        .mockImplementationOnce(() => {});
    // when
    popupController.onMessageFromPopup(dialog, givenArg);
    // then
    expect(handleErrorSpy).toBeCalled();
    const handleErrorArgs = handleErrorSpy.mock.calls[0];
    expect(handleErrorArgs[0].constructor).toBe(EnvironmentNotFoundError);
    expect(handleErrorArgs[1]).toBe(false);
    expect(dialog.close).toBeCalled();
  });
});
