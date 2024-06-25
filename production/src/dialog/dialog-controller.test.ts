import { authenticationHelper } from '../authentication/authentication-helper';
import { officeApiHelper } from '../office/api/office-api-helper';
import { dialogMessageService } from './dialog-message-service';

import { reduxStore } from '../store';

import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';
import { ReportParams } from './dialog-controller-types';

import { dialogController } from './dialog-controller';

import { Office } from '../../__mocks__/mockOffice';

describe('Dialog Controller', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should run popup with proper settings when called for navigation', () => {
    // given
    const popupType = DialogType.libraryWindow;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(dialogController, 'runPopup')
      .mockImplementationOnce(async () => {});

    // when
    dialogController.runPopupNavigation();
    // then

    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size);
  });

  it('should call displayDialogAsync on runPopup invocation', async () => {
    // given
    const popupType = DialogType.editFilters;
    jest.spyOn(authenticationHelper, 'validateAuthToken').mockImplementationOnce(async () => {});
    jest.spyOn(dialogMessageService, 'onMessageFromDialog').mockImplementationOnce(async () => {});
    jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementationOnce(async () => true);
    // when
    await dialogController.runPopup(popupType, 80, 80);
    // then
    expect(Office.context.ui.displayDialogAsync).toHaveBeenCalled();
  });

  it('should run edit popup with proper settings', () => {
    // given
    const reportParams: ReportParams = { bindId: 'bindId' };
    const popupType = DialogType.editFilters;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(dialogController, 'runPopup')
      .mockImplementationOnce(async () => {});

    // when
    dialogController.runEditFiltersPopup(reportParams);

    // then
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should run edit dossier popup with proper settings', () => {
    // given
    const reportParams: ReportParams = { bindId: 'bindId' };
    const popupType = DialogType.dossierWindow;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(dialogController, 'runPopup')
      .mockImplementationOnce(async () => {});

    // when
    dialogController.runEditDossierPopup(reportParams);

    // then
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should run reprompt popup with proper settings', () => {
    // given
    const reportParams: ReportParams = { bindId: 'bindId' };
    const popupType = DialogType.repromptingWindow;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(dialogController, 'runPopup')
      .mockImplementationOnce(async () => {});

    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    dialogController.runRepromptPopup(reportParams);

    // then
    expect(dispatchSpy).toHaveBeenCalled();
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should run repromptDossier popup with proper settings', () => {
    // given
    const reportParams = 'chosenObjectData';
    const popupType = DialogType.dossierWindow;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(dialogController, 'runPopup')
      .mockImplementationOnce(async () => {});

    const dispatchSpy = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    // when
    dialogController.runRepromptDossierPopup(reportParams);

    // then
    expect(dispatchSpy).toHaveBeenCalled();
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, reportParams);
  });

  it('should run importedDataOverview popup', () => {
    // given
    const popupType = DialogType.importedDataOverview;
    const size = 80;
    const runPopupSpy = jest
      .spyOn(dialogController, 'runPopup')
      .mockImplementationOnce(async () => {});

    // when
    dialogController.runImportedDataOverviewPopup();

    // then
    expect(runPopupSpy).toHaveBeenCalled();
    expect(runPopupSpy).toBeCalledWith(popupType, size, size, null);
  });
});
