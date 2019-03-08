import {sessionHelper} from '../../src/storage/session-helper';
import {fileHistoryHelper} from '../../src/file-history/file-history-helper';
import {notificationService} from '../../src/notification/notification-service';
import {errorService} from '../../src/error/error-handler';
import {reduxStore} from '../../src/store';
import {officeProperties} from '../../src/office/office-properties';
import {authenticationHelper} from '../../src/authentication/authentication-helper';

jest.mock('../../src/authentication/authentication-helper');
jest.mock('../../src/storage/session-helper');
jest.mock('../../src/notification/notification-service');
jest.mock('../../src/error/error-handler');

describe('FileHistoryHelper', () => {
  beforeAll(() => {
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => { });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe('refreshReport', () => {
    it('should call provided method', async () => {
      // given
      const mockedOnRefresh = jest.fn();
      authenticationHelper.validateAuthToken = jest.fn().mockImplementation(() => {});
      const testBindId = 'someBindingIt';
      // when
      await fileHistoryHelper.refreshReport(mockedOnRefresh, testBindId);
      // then
      expect(mockedOnRefresh).toBeCalled();
      expect(authenticationHelper.validateAuthToken).toBeCalled();
      expect(mockedOnRefresh).toBeCalledWith(testBindId);
    });
    it('should not call provided method in no action session', async () => {
      // given
      const mockedOnRefresh = jest.fn();
      authenticationHelper.validateAuthToken = jest.fn().mockImplementation(() => {
        throw Error();
      });
      const testBindId = 'someBindingIt';
      // when
      await fileHistoryHelper.refreshReport(mockedOnRefresh, testBindId);
      // then
      expect(mockedOnRefresh).not.toBeCalled();
      expect(authenticationHelper.validateAuthToken).toBeCalled();
      expect(mockedOnRefresh).not.toBeCalledWith(testBindId);
    });
    it('should display message on success', async () => {
      // given
      const mockedDisplayMessage = notificationService.displayMessage;
      authenticationHelper.validateAuthToken = jest.fn().mockImplementation(() => {});
      const mockedOnRefresh = jest.fn();
      const testBindId = 'someBindingIt';
      // when
      await fileHistoryHelper.refreshReport(mockedOnRefresh, testBindId);
      // then
      expect(mockedDisplayMessage).toBeCalled();
      expect(authenticationHelper.validateAuthToken).toBeCalled();
      expect(mockedDisplayMessage).toBeCalledWith('info', 'Report refreshed');
    });
    it('should trigger handleError on error', async () => {
      // given
      const testError = new Error('Some error');
      authenticationHelper.validateAuthToken = jest.fn().mockImplementation(() => {});
      const mockedOnRefresh = jest.fn().mockRejectedValue(testError);
      const testBindId = 'someBindingIt';
      const mockedErrorHandler = errorService.handleError;
      // when
      await fileHistoryHelper.refreshReport(mockedOnRefresh, testBindId);
      // then
      expect(mockedErrorHandler).toBeCalled();
      expect(authenticationHelper.validateAuthToken).toBeCalled();
      expect(mockedErrorHandler).toBeCalledWith(testError);
    });
    it('should dispatch startLoadingReport action and finishLoadingReport later when refreshed', async () => {
      // given
      const mockedOnRefresh = jest.fn();
      authenticationHelper.validateAuthToken = jest.fn().mockImplementation(() => {});
      const testBindId = 'someBindingIt';
      // when
      await fileHistoryHelper.refreshReport(mockedOnRefresh, testBindId);
      // then
      expect(authenticationHelper.validateAuthToken).toBeCalled();
      expect(reduxStore.dispatch).toBeCalledWith({
        type: officeProperties.actions.startLoadingReport,
        reportBindId: testBindId,
      });
      expect(reduxStore.dispatch).toBeCalledWith({
        type: officeProperties.actions.finishLoadingReport,
        reportBindId: testBindId,
      });
    });
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
      // when
      await fileHistoryHelper.deleteReport(mockedOnDelete, testBindId);
      // then
      expect(mockedOnDelete).toBeCalled();
      expect(mockedOnDelete).toBeCalledWith(testBindId);
    });
    it('should display message on success', async () => {
      // given
      const mockedDisplayMessage = notificationService.displayMessage;
      const mockedOnDelete = jest.fn();
      const testBindId = 'someBindingIt';
      // when
      await fileHistoryHelper.deleteReport(mockedOnDelete, testBindId);
      // then
      expect(mockedDisplayMessage).toBeCalled();
      expect(mockedDisplayMessage).toBeCalledWith('info', 'Report removed');
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
