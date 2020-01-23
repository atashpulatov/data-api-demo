import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { libraryErrorController } from '@mstr/mstr-react-library';
import { Popup } from '../../popup/popup';
import { popupStateActions, SET_MSTR_DATA } from '../../popup/popup-state-actions';
import { popupHelper } from '../../popup/popup-helper';
import { PopupViewSelector } from '../../popup/popup-view-selector';
import { Office } from '../mockOffice';
import i18next from '../../i18n';
import { reduxStore } from '../../store';

describe('Popup.js', () => {
  it('should render PopupViewSelector', () => {
    // given
    // when
    const componentWrapper = shallow(<Popup />);

    // then
    const popupButtonsWrapped = componentWrapper.find(PopupViewSelector);
    expect(popupButtonsWrapped.get(0)).toBeDefined();
  });

  it('should call libraryErrorController.initializeHttpErrorsHandling', () => {
    // given
    const libraryErrorControllerSpy = jest.spyOn(libraryErrorController, 'initializeHttpErrorsHandling');
    const mstrSetDataFunction = jest.fn();

    // when
    mount(
      <Provider store={reduxStore}>
        <Popup setMstrData={mstrSetDataFunction} />
      </Provider>
    );

    // then
    expect(libraryErrorControllerSpy).toHaveBeenCalledWith(popupHelper.handlePopupErrors);
  });

  it('should call i18next.changeLanguage with en-US', () => {
    // given
    const i18nextSpy = jest.spyOn(i18next, 'changeLanguage');
    const mstrSetDataFunction = jest.fn();
    const location = { search: 'searchString' };

    // when
    mount(
      <Provider store={reduxStore}>
        <Popup location={location} setMstrData={mstrSetDataFunction} />
      </Provider>
    );

    // then
    expect(i18nextSpy).toHaveBeenCalledWith('en-US');
  });

  describe('Popup.js with existing i18next.options.resources and Office.context.displayLanguage', () => {
    const originalI18nextOptionsResources = i18next.options.resources;
    const originalOfficeContextDisplayLanguage = Office.context.displayLanguage;

    beforeEach(() => {
      i18next.options.resources = { displayLanguageCode: true };
      Office.context.displayLanguage = 'displayLanguageCode';
    });

    afterEach(() => {
      i18next.options.resources = originalI18nextOptionsResources;
      Office.context.displayLanguage = originalOfficeContextDisplayLanguage;
    });

    it('should call i18next.changeLanguage with displayLanguageCode', () => {
      // given
      const i18nextSpy = jest.spyOn(i18next, 'changeLanguage');
      const mstrSetDataFunction = jest.fn();
      // when
      mount(
        <Provider store={reduxStore}>
          <Popup setMstrData={mstrSetDataFunction} />
        </Provider>
      );

      // then
      expect(i18nextSpy).toHaveBeenCalledWith('displayLanguageCode');
    });
  });

  describe('Popup.js with existing i18next.options.resources with no Office.context.displayLanguage', () => {
    const originalI18nextOptionsResources = i18next.options.resources;
    const originalOfficeContextDisplayLanguage = Office.context.displayLanguage;

    beforeEach(() => {
      i18next.options.resources = { displayLanguageCode: true };
      Office.context.displayLanguage = 'notExistingdisplayLanguageCode';
    });

    afterEach(() => {
      i18next.options.resources = originalI18nextOptionsResources;
      Office.context.displayLanguage = originalOfficeContextDisplayLanguage;
    });

    it('should call i18next.changeLanguage with en-US', () => {
      // given
      const i18nextSpy = jest.spyOn(i18next, 'changeLanguage');
      const mstrSetDataFunction = jest.fn();

      // when
      mount(
        <Provider store={reduxStore}>
          <Popup setMstrData={mstrSetDataFunction} />
        </Provider>
      );

      // then
      expect(i18nextSpy).toHaveBeenCalledWith('en-US');
    });
  });
});
