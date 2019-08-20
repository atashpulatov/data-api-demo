import {sessionHelper} from '../../storage/session-helper';
import {fileHistoryHelper} from '../../file-history/file-history-helper';
import {notificationService} from '../../notification/notification-service';
import {errorService} from '../../error/error-handler';
import {reduxStore} from '../../store';

jest.mock('../../authentication/authentication-helper');
jest.mock('../../storage/session-helper');
jest.mock('../../notification/notification-service');
jest.mock('../../error/error-handler');

describe('FileHistoryHelper', () => {
  beforeAll(() => {
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe('deleteReport', () => {
    it('should enable loading on run and disable later when delete', async () => {
      // given
      const enableLoadingMock = sessionHelper.enableLoading;
      const disableLoadingMock = sessionHelper.disableLoading;
      const mockedOnDelete = jest.fn();
      const testBindId = 'someBindingIt';
      // when
      await fileHistoryHelper.deleteReport(mockedOnDelete, testBindId);
      // then
      expect(enableLoadingMock).toBeCalled();
      expect(disableLoadingMock).toBeCalled();
    });
    it('should call provided method', async () => {
      // given
      const mockedOnDelete = jest.fn();
      const testBindId = 'someBindingIt';
      const isCrosstab = true;
      const headerDimensions = {};
      const name = 'test';
      // when
      await fileHistoryHelper.deleteReport(mockedOnDelete, testBindId, isCrosstab, headerDimensions, name);
      // then
      expect(mockedOnDelete).toBeCalled();
      expect(mockedOnDelete).toBeCalledWith(testBindId, isCrosstab, headerDimensions);
    });
    it('should display message on success', async () => {
      // given
      const mockedDisplayMessage = notificationService.displayTranslatedNotification;
      const mockedOnDelete = jest.fn().mockImplementation(() => true);
      const testBindId = 'someBindingIt';
      const isCrosstab = true;
      const headerDimensions = {};
      const message = 'test name';
      // when
      await fileHistoryHelper.deleteReport(mockedOnDelete, testBindId, isCrosstab, headerDimensions, message);
      // then
      expect(mockedDisplayMessage).toBeCalled();
      expect(mockedDisplayMessage).toBeCalledWith('success', message);
    });
    it('should not display message without success', async () => {
      // given
      const mockedDisplayMessage = notificationService.displayNotification;
      const mockedOnDelete = jest.fn();
      const testBindId = 'someBindingIt';
      // when
      await fileHistoryHelper.deleteReport(mockedOnDelete, testBindId);
      // then
      expect(mockedDisplayMessage).not.toBeCalled();
    });
    it('should trigger handleError on error', async () => {
      // given
      const testError = new Error('Some error');
      const mockedOnDelete = jest.fn().mockRejectedValue(testError);
      const testBindId = 'someBindingIt';
      const mockedErrorHandler = errorService.handleError;
      // when
      await fileHistoryHelper.deleteReport(mockedOnDelete, testBindId);
      // then
      expect(mockedErrorHandler).toBeCalled();
      expect(mockedErrorHandler).toBeCalledWith(testError);
    });
  });
});
