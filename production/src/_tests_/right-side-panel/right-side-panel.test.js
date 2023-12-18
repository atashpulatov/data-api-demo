import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { shallow, mount } from 'enzyme';
import { SidePanel } from '@mstr/connector-components/';
import PrivilegeErrorSidePanel from '../../right-side-panel/info-panels/privilege-error-side-panel';
import { RightSidePanelNotConnected } from '../../right-side-panel/right-side-panel';
import { officeApiHelper } from '../../office/api/office-api-helper';
import officeStoreHelper from '../../office/store/office-store-helper';
import { sidePanelEventHelper } from '../../right-side-panel/side-panel-event-helper';
import { sidePanelNotificationHelper } from '../../right-side-panel/side-panel-notification-helper';

describe('RightSidePanelNotConnected', () => {
  let mockedProps;

  beforeEach(() => {
    mockedProps = {
      loadedObjects: [],
      isConfirm: false,
      isSettings: false,
      cancelCurrentImportRequest: jest.fn(),
      toggleIsSettingsFlag: jest.fn(),
      toggleSecuredFlag: jest.fn(),
      toggleIsClearDataFailedFlag: jest.fn(),
      canUseOffice: true
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call toggleSecureFlag if file is secured', () => {
    // given
    jest.spyOn(officeStoreHelper, 'isFileSecured').mockReturnValue(true);
    jest.spyOn(officeStoreHelper, 'isClearDataFailed').mockReturnValue(true);

    // when
    mount(
      <RightSidePanelNotConnected {...mockedProps} />
    );

    // then
    expect(mockedProps.toggleSecuredFlag).toBeCalledWith(true);
    expect(mockedProps.toggleIsClearDataFailedFlag).toBeCalledWith(true);
  });

  it('should display SidePanel', () => {
    // given
    // when
    const shallowedComponent = shallow(<RightSidePanelNotConnected {...mockedProps} />);

    // then
    expect(shallowedComponent.find(SidePanel)).toHaveLength(1);
    expect(shallowedComponent.find(PrivilegeErrorSidePanel)).toHaveLength(0);
  });

  it('should provide loadedObjects to SidePanel', () => {
    // given
    // when
    const shallowedComponent = shallow(<RightSidePanelNotConnected {...mockedProps} />);

    // then
    const shallowedSidePanel = shallowedComponent.find(SidePanel).at(0);
    expect(shallowedSidePanel.prop('loadedObjects')).toBe(mockedProps.loadedObjects);
  });

  it('should provide settingsMenu to SidePanel when isSettings is true', () => {
    // given
    jest.spyOn(officeStoreHelper, 'isFileSecured').mockReturnValue(true);
    jest.spyOn(officeStoreHelper, 'isClearDataFailed').mockReturnValue(true);

    // when
    const wrappedComponent = mount(<RightSidePanelNotConnected {...mockedProps} isSettings />);

    // then
    const wrappedSidePanel = wrappedComponent.find(SidePanel).at(0);
    expect(wrappedSidePanel.prop('settingsMenu')).toBeTruthy();
  });

  it('should provide confirmationWindow to SidePanel when isConfirm is true', () => {
    // given
    jest.spyOn(officeStoreHelper, 'isFileSecured').mockReturnValue(true);
    jest.spyOn(officeStoreHelper, 'isClearDataFailed').mockReturnValue(true);

    // when
    const wrappedComponent = mount(<RightSidePanelNotConnected {...mockedProps} isConfirm />);

    // then
    const wrappedSidePanel = wrappedComponent.find(SidePanel).at(0);
    expect(wrappedSidePanel.prop('confirmationWindow')).toBeTruthy();
  });

  it('should call toggleIsSettingsFlag with inverse value of isSettings prop', () => {
    // given
    mockedProps.isSettings = true;
    const wrappedComponent = shallow(<RightSidePanelNotConnected {...mockedProps} />);
    // when
    wrappedComponent.find(SidePanel).prop('onSettingsClick')();
    // then
    expect(mockedProps.toggleIsSettingsFlag).toHaveBeenCalled();
  });

  it('should call addRemoveObjectListener and initializeActiveCellChangedListener on mount', async () => {
    // given
    const spyAddRemoveObjectListener = jest.spyOn(sidePanelEventHelper, 'addRemoveObjectListener');
    const spyInitializeActiveCellChangedListener = jest.spyOn(sidePanelEventHelper, 'initializeActiveCellChangedListener');
    // when
    mount(<RightSidePanelNotConnected {...mockedProps} />);
    // then
    await new Promise(setImmediate);
    expect(spyAddRemoveObjectListener).toBeCalled();
    expect(spyInitializeActiveCellChangedListener).toBeCalled();
  });

  it('should call setDuplicatePopup on onDuplicateClick', async () => {
    // given
    const spySetDuplicatePopup = jest.spyOn(sidePanelNotificationHelper, 'setDuplicatePopup').mockImplementationOnce(() => { });
    const spyCheckStatusOfSessions = jest.spyOn(officeApiHelper, 'checkStatusOfSessions').mockImplementationOnce(() => { });
    // when
    const wrappedComponent = mount(<RightSidePanelNotConnected {...mockedProps} />);
    await wrappedComponent.find(SidePanel).prop('onDuplicateClick')();
    // then
    expect(spyCheckStatusOfSessions).toBeCalled();
    expect(spySetDuplicatePopup).toBeCalled();
  });
});
