import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { PopupViewSelector, PopupViewSelectorNotConnected } from '../../popup/popup-view-selector';
import { PromptsWindow } from '../../prompts/prompts-window';
import { PopupTypeEnum } from '../../home/popup-type-enum';
import { NavigationTree } from '../../navigation/navigation-tree';
import { AttributeSelectorWindow } from '../../attribute-selector/attribute-selector-window';
import { DossierWindow } from '../../dossier/dossier-window';
import { LoadingPage } from '../../loading/loading-page';
import { RefreshAllPage } from '../../loading/refresh-all-page';
import { popupViewSelectorHelper } from '../../popup/popup-view-selector-helper';
import { popupHelper } from '../../popup/popup-helper';
import { popupActions, SET_PREPARED_REPORT } from '../../popup/popup-actions';

jest.mock('../../popup/popup-helper');
jest.mock('../../popup/popup-view-selector-helper');

describe('PopupViewSelectorNotConnected', () => {
  it('should not render anything when no authToken provided', () => {
    // given
    const setPopupType = jest.spyOn(popupViewSelectorHelper, 'setPopupType');

    // when
    const componentWrapper = shallow(<PopupViewSelectorNotConnected />);

    // then
    expect(setPopupType).not.toBeCalled();
    expect(componentWrapper.find(PopupViewSelectorNotConnected).get(0)).not.toBeDefined();
  });

  it('should not render anything when authToken provided and popupType not known', () => {
    // given
    const setPopupType = jest.spyOn(popupViewSelectorHelper, 'setPopupType');

    // when
    const componentWrapper = shallow(<PopupViewSelectorNotConnected authToken="testAuthToken" />);

    // then
    expect(setPopupType).toBeCalled();
    expect(componentWrapper.find(PopupViewSelectorNotConnected).get(0)).not.toBeDefined();
  });

  it.each`
  popupType                          | expectedComponent
  ${PopupTypeEnum.dataPreparation}   | ${AttributeSelectorWindow}
  ${PopupTypeEnum.editFilters}       | ${AttributeSelectorWindow}
  ${PopupTypeEnum.navigationTree}    | ${NavigationTree}
  ${PopupTypeEnum.loadingPage}       | ${LoadingPage}
  ${PopupTypeEnum.refreshAllPage}    | ${RefreshAllPage}
  ${PopupTypeEnum.promptsWindow}     | ${PromptsWindow}
  ${PopupTypeEnum.repromptingWindow} | ${PromptsWindow}
  ${PopupTypeEnum.dossierWindow}     | ${DossierWindow}
  `('should render $expectedComponent when setPopupType returns $popupType', ({ popupType, expectedComponent }) => {
  // given
  const setPopupType = jest.spyOn(popupViewSelectorHelper, 'setPopupType').mockImplementation(() => popupType);

  // when
  const componentWrapper = shallow(<PopupViewSelectorNotConnected authToken="testAuthToken" />);

  // then
  expect(setPopupType).toBeCalled();
  expect(componentWrapper.find(expectedComponent).get(0)).toBeDefined();
});

  it('should render empty <div /> when authToken provided and popupType equals PopupTypeEnum.emptyDiv', () => {
    // given
    const setPopupType = jest.spyOn(popupViewSelectorHelper, 'setPopupType')
      .mockImplementation(() => PopupTypeEnum.emptyDiv);

    // when
    const componentWrapper = shallow(<PopupViewSelectorNotConnected authToken="testAuthToken" />);

    // then
    expect(setPopupType).toBeCalled();
    expect(componentWrapper.html()).toBe('<div></div>');
  });
});

describe('PopupViewSelectorNotConnected mapStateToProps and mapDispatchToProps test', () => {
  const mockStore = configureMockStore([thunk]);
  let store;
  let componentWrapper;

  beforeEach(() => {
    const initialState = {
      popupReducer: {
        editedObject: { objectType: { name: 'report' } },
        preparedInstance: 'testPreparedInstance'
      },
      popupStateReducer: {
        popupType: 'testPopupType',
        otherDefinedProperty: 'testOtherProperty',
        otherPopupStateReducerProperty: 'testOtherValue'
      },
      navigationTree: {
        promptsAnswers: 'testPromptsAnswers',
        otherNavigationTreeProperty: 'testOtherNavigationTreeProperty'
      },
      sessionReducer: {
        authToken: 'testAuthToken',
        attrFormPrivilege: true
      },
      officeReducer: { supportForms: true }
    };

    store = mockStore(initialState);

    componentWrapper = shallow(
      <PopupViewSelector store={store} />
    ).find(PopupViewSelectorNotConnected);
  });

  it('should use mapStateToProps', () => {
    // given
    const parsePopupState = jest.spyOn(popupHelper, 'parsePopupState');

    // when
    // then
    expect(componentWrapper.props().authToken).toBe('testAuthToken');
    expect(componentWrapper.props().otherNavigationTreeProperty).toBe('testOtherNavigationTreeProperty');
    expect(parsePopupState).toBeCalledWith({ objectType: { name: 'report' } }, 'testPromptsAnswers', true);
    // editedObject not fully tested, only that popupHelper.parsePopupState is executed (mocking not working)
    expect(componentWrapper.props().preparedInstance).toBe('testPreparedInstance');
    expect(componentWrapper.props().propsToPass).toHaveProperty('otherPopupStateReducerProperty', 'testOtherValue');
    expect(componentWrapper.props().popupType).toBe('testPopupType');
  });

  it('should use mapDispatchToProps', () => {
    // given
    // when
    store.dispatch(popupActions.preparePromptedReport('testInstanceId', 'testChosenObjectData'));

    // then
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      instanceId: 'testInstanceId',
      chosenObjectData: 'testChosenObjectData',
      type: SET_PREPARED_REPORT
    });
  });
});
