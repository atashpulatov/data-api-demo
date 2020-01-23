import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { libraryErrorController } from '@mstr/mstr-react-library';
import { Popup, PopupNotConnected } from '../../popup/popup';
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
    const componentWrapper = shallow(<PopupNotConnected />);

    // then
    const popupButtonsWrapped = componentWrapper.find(PopupViewSelector);
    expect(popupButtonsWrapped.get(0)).toBeDefined();
  });

  it('should throw error when no location and no setMstrData provided', () => {
    // given
    // when
    const callThatThrows = () => {
      mount(
        <Provider store={reduxStore}>
          <PopupNotConnected />
        </Provider>
      );
    };

    // then
    expect(callThatThrows).toThrowError(new Error('setMstrData is not a function'));
  });

  it('should throw error when location provided and setMstrData not provided', () => {
    // given
    // when
    const callThatThrows = () => {
      mount(
        <Provider store={reduxStore}>
          <PopupNotConnected />
        </Provider>
      );
    };

    // then
    expect(callThatThrows).toThrowError(new Error('setMstrData is not a function'));
  });

  describe('Popup.js with window.location modification', () => {
    const originalWindowLocation = window.location;

    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { search: '?windowVariable=valueValue' },
        writable: true
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', {
        value: originalWindowLocation,
        writable: true
      });
    });

    it('should use window.location.search when location is not provided', () => {
      // given
      const mstrSetDataFunction = jest.fn();

      // when
      mount(
        <Provider store={reduxStore}>
          <PopupNotConnected setMstrData={mstrSetDataFunction} />
        </Provider>
      );

      // then
      expect(mstrSetDataFunction).toBeCalledWith({ windowVariable: 'valueValue' });
    });
  });

  it.each`
    location                                                  | expected
    ${''}                                                     | ${{}}
    ${'string location'}                                      | ${{}}
    ${{}}                                                     | ${{}}
    ${{ noSearch: '' }}                                       | ${{}}
    ${{ search: '' }}                                         | ${{}}
    ${{ search: '?value' }}                                   | ${{ value: null }}
    ${{ search: '?var=value' }}                               | ${{ var: 'value' }}
    ${{ search: '?var=value&popupType=noRepromptingWindow' }} | ${{ var: 'value', popupType: 'noRepromptingWindow' }}
    ${{ search: '?var=value&popupType=reprompting-window' }}  | ${{
      var: 'value',
    popupType: 'reprompting-window',
    isReprompt: true
  }}
  `('should return $expected when location is "$location"', ({ location, expected }) => {
    // given
    const mstrSetDataFunction = jest.fn();

    // when
    mount(
      <Provider store={reduxStore}>
        <PopupNotConnected setMstrData={mstrSetDataFunction} location={location} />
      </Provider>
    );

    // then
    expect(mstrSetDataFunction).toBeCalledWith(expected);
  });

  it('should call libraryErrorController.initializeHttpErrorsHandling', () => {
    // given
    const libraryErrorControllerSpy = jest.spyOn(libraryErrorController, 'initializeHttpErrorsHandling');
    const mstrSetDataFunction = jest.fn();

    // when
    mount(
      <Provider store={reduxStore}>
        <PopupNotConnected setMstrData={mstrSetDataFunction} />
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
        <PopupNotConnected location={location} setMstrData={mstrSetDataFunction} />
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
          <PopupNotConnected setMstrData={mstrSetDataFunction} />
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
          <PopupNotConnected setMstrData={mstrSetDataFunction} />
        </Provider>
      );

      // then
      expect(i18nextSpy).toHaveBeenCalledWith('en-US');
    });
  });

  describe('Popup.js mapStateToProps and mapDispatchToProps test', () => {
    const mockStore = configureMockStore([thunk]);
    let store;
    let componentWrapper;

    beforeEach(() => {
      const initialState = {
        popupStateReducer: {
          popupType: 'testPopupType',
          otherDefinedProperty: 'testOtherProperty'
        }
      };

      store = mockStore(initialState);

      componentWrapper = shallow(
        <Popup store={store} />
      ).find(PopupNotConnected);
    });

    it('should use mapStateToProps', () => {
      // given
      // when
      // then
      expect(componentWrapper.props().popupType).toBe('testPopupType');
      expect(componentWrapper.props().mstrData.otherDefinedProperty).toBe('testOtherProperty');
      expect(componentWrapper.props().mstrData.noDefinedProperty).not.toBeDefined();
    });

    it('should use mapDispatchToProps', () => {
      // given
      // when
      store.dispatch(popupStateActions.setMstrData('testPayload'));

      // then
      const actions = store.getActions();
      expect(actions[0]).toEqual({ payload: 'testPayload', type: SET_MSTR_DATA });
    });
  });
});
