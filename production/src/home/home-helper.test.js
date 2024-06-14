import { authenticationHelper } from '../authentication/authentication-helper';
import { browserHelper } from '../helpers/browser-helper';
import { storageHelper } from '../helpers/storage-helper';
import { officeApiHelper } from '../office/api/office-api-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { officeShapeApiHelper } from '../office/shapes/office-shape-api-helper';
import officeStoreHelper from '../office/store/office-store-helper';
import { sessionHelper } from '../storage/session-helper';
import { homeHelper } from './home-helper';

import { reduxStore } from '../store';

import { officeContext } from '../office/office-context';
import { configActions } from '../redux-reducer/config-reducer/config-actions';
import { sessionActions } from '../redux-reducer/session-reducer/session-actions';
import { ObjectImportType } from '../mstr-object/constants';

describe('HomeHelper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('saveLoginValues', () => {
    it('should trigger logout because of missing authToken and running on localhost', () => {
      // given
      jest
        .spyOn(reduxStore, 'getState')
        .mockReturnValueOnce({ sessionReducer: { authToken: null } });
      jest.spyOn(browserHelper, 'isDevelopment').mockReturnValueOnce(true);
      sessionActions.logOut = jest.fn();
      // when
      authenticationHelper.saveLoginValues();
      // then
      expect(sessionActions.logOut).toBeCalled();
    });
    it('prepare envUrl and save it to store', () => {
      // given
      sessionActions.logOut = jest.fn();
      jest.spyOn(browserHelper, 'getWindowLocation').mockReturnValueOnce({
        origin: 'https://some-env.microstrategy.com/',
        pathname: 'MicroStrategyLibrary/apps/addin-mstr-office/index.html?source=addin-mstr-office',
      });
      jest.spyOn(browserHelper, 'isDevelopment').mockReturnValueOnce(false);
      jest
        .spyOn(reduxStore, 'getState')
        .mockReturnValueOnce({ sessionReducer: { authToken: 'someToken' } });

      const logOutMock = jest.spyOn(sessionActions, 'logOut').mockImplementation();
      const saveLoginValuesMock = jest
        .spyOn(sessionActions, 'saveLoginValues')
        .mockImplementation();

      const expectedCalledUrl = {
        envUrl: 'https://some-env.microstrategy.com/MicroStrategyLibrary/api',
      };
      // when
      authenticationHelper.saveLoginValues();
      // then
      expect(logOutMock).not.toHaveBeenCalled();
      expect(saveLoginValuesMock).toHaveBeenCalledWith(expectedCalledUrl);
    });
  });
  describe('getParsedCookies', () => {
    it('should cookie', () => {
      // given
      const exampleToken = 'someToken';
      const exampleCookies = `someCookie=1; otherCookie=1; iSession=${exampleToken}`;
      const expectedCookieArray = {
        someCookie: '1',
        otherCookie: '1',
        iSession: exampleToken,
      };
      jest.spyOn(browserHelper, 'getDocumentCookie').mockReturnValueOnce(exampleCookies);
      // when
      const resultCookieArray = homeHelper.getParsedCookies();
      // then
      expect(resultCookieArray).toEqual(expectedCookieArray);
    });
  });
  describe('getTokenFromStorage', () => {
    it('should not save when there is no iSession', () => {
      // given
      const iSession = null;
      jest.spyOn(storageHelper, 'getStorageItem').mockReturnValueOnce(iSession);
      jest.spyOn(officeStoreHelper, 'getPropertyValue').mockReturnValueOnce(iSession);
      const logInMock = jest.spyOn(sessionActions, 'logIn').mockImplementation();
      // when
      sessionHelper.getTokenFromStorage();
      // then
      expect(logInMock).not.toHaveBeenCalled();
    });
    it('should save authToken when there is iSession in Excel settings', () => {
      // given
      const iSession = 'token';
      jest.spyOn(storageHelper, 'getStorageItem').mockReturnValueOnce(null);
      jest.spyOn(officeStoreHelper, 'getPropertyValue').mockReturnValueOnce(iSession);
      const logInMock = jest.spyOn(sessionActions, 'logIn').mockImplementation();
      // when
      sessionHelper.getTokenFromStorage();
      // then
      expect(logInMock).toHaveBeenCalledWith(iSession);
    });
    it('should save authToken when there is iSession in storage', () => {
      // given
      const iSession = 'token';
      jest.spyOn(storageHelper, 'getStorageItem').mockReturnValueOnce(iSession);
      const logInMock = jest.spyOn(sessionActions, 'logIn').mockImplementation();
      // when
      sessionHelper.getTokenFromStorage();
      // then

      expect(logInMock).toHaveBeenCalledWith(iSession);
    });
    it('should return window location', () => {
      // given
      const locationHelper = jest.spyOn(browserHelper, 'getWindowLocation');
      // when
      const location = browserHelper.getWindowLocation();
      // then
      expect(locationHelper).toBeCalled();
      expect(location).toBeTruthy();
    });
    it('should return document cookie', () => {
      // given
      const cookieHelper = jest.spyOn(browserHelper, 'getDocumentCookie');
      // when
      browserHelper.getDocumentCookie();
      // then
      expect(cookieHelper).toBeCalled();
    });
  });

  describe('storeShowHidden', () => {
    it.each`
      excelSettingValue | localStorageValue | expectedShowHiddenPayload
      ${true}           | ${'true'}         | ${true}
      ${false}          | ${'false'}        | ${false}
      ${undefined}      | ${'true'}         | ${true}
      ${true}           | ${''}             | ${true}
      ${undefined}      | ${''}             | ${true}
    `(
      'should dispatch setSHowHidden action with correct payload',
      ({ excelSettingValue, localStorageValue, expectedShowHiddenPayload }) => {
        // given
        jest.spyOn(officeStoreHelper, 'getPropertyValue').mockReturnValue(excelSettingValue);
        jest.spyOn(storageHelper, 'getStorageItem').mockReturnValue(localStorageValue);
        const actionPayloadSpy = jest.spyOn(configActions, 'setShowHidden');
        const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

        // when
        homeHelper.storeShowHidden();

        // then
        expect(actionPayloadSpy).toHaveBeenCalledWith(expectedShowHiddenPayload);
        expect(mockedDispatch).toHaveBeenCalledTimes(1);
      }
    );
  });

  describe('initIsShapeAPISupported', () => {
    it('should return true if shape API is supported', () => {
      // given
      const windowSpy = jest.spyOn(global, 'window', 'get');
      windowSpy.mockImplementation(() => ({
        Office: {
          context: {
            requirements: {
              isSetSupported: () => true,
            },
          },
        },
      }));

      jest.spyOn(officeContext, 'isSetSupported').mockImplementation();

      jest.spyOn(reduxStore, 'dispatch').mockImplementation();

      // when
      homeHelper.initSupportedFeaturesFlags();
      expect(officeContext.isSetSupported).toHaveBeenCalled();
      expect(reduxStore.dispatch).toHaveBeenCalled();
    });
  });

  describe('secureData()', () => {
    it('should skip clearDataRequested() dispatch for image object.', async () => {
      // given
      const excelContextMock = {
        workbook: {
          worksheets: [{}],
        },
      };

      const objects = [
        {
          importType: ObjectImportType.IMAGE,
          bindId: '{778543A2-0A92-DBB4-E471-1C55D2C48DFF}',
          objectWorkingId: 1709325494755,
        },
        {
          importType: ObjectImportType.TABLE,
          bindId: '{45E0499F-6C8A-4909-AF68-40C7A293ACA1}',
          objectWorkingId: 1709325744657,
        },
      ];

      jest
        .spyOn(officeApiHelper, 'getExcelContext')
        .mockImplementation(() => Promise.resolve(excelContextMock));

      jest.spyOn(officeApiWorksheetHelper, 'checkIfAnySheetProtected').mockImplementation();

      jest.spyOn(officeShapeApiHelper, 'getShape').mockImplementation(() => undefined);

      jest.spyOn(reduxStore, 'dispatch').mockImplementation();
      // when

      setTimeout(async () => {
        await homeHelper.secureData(objects);

        expect(officeApiHelper.getExcelContext).toHaveBeenCalled();
        expect(officeShapeApiHelper.getShape).toHaveBeenCalledWith(
          excelContextMock,
          '{778543A2-0A92-DBB4-E471-1C55D2C48DFF}'
        );
        expect(homeHelper.reduxStore.dispatch).toHaveBeenCalledTimes(1);
      }, 0);
    });
  });
});
