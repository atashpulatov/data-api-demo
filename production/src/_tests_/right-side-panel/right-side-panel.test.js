import React from 'react';
import { shallow, mount } from 'enzyme';
import { SidePanel } from '@mstr/rc/';
import { RightSidePanelNotConnected } from '../../right-side-panel/right-side-panel';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { sidePanelService } from '../../right-side-panel/side-panel-service';
import officeStoreHelper from '../../office/store/office-store-helper';

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

  it('should call addRemoveObjectListener and initializeActiveCellChangedListener on mount', () => {
    // given
    const spyAddRemoveObjectListener = jest.spyOn(sidePanelService, 'addRemoveObjectListener');
    const spyInitializeActiveCellChangedListener = jest.spyOn(sidePanelService, 'initializeActiveCellChangedListener');
    // when
    mount(<RightSidePanelNotConnected {...mockedProps} />);
    // then
    expect(spyAddRemoveObjectListener).toBeCalled();
    expect(spyInitializeActiveCellChangedListener).toBeCalled();
  });

  it('should call setDuplicatePopup on onDuplicateClick', async () => {
    // given
    const spySetDuplicatePopup = jest.spyOn(sidePanelService, 'setDuplicatePopup').mockImplementationOnce(() => { });
    const spyCheckStatusOfSessions = jest.spyOn(officeApiHelper, 'checkStatusOfSessions').mockImplementationOnce(() => { });
    // when
    const wrappedComponent = mount(<RightSidePanelNotConnected {...mockedProps} />);
    await wrappedComponent.find(SidePanel).prop('onDuplicateClick')();
    // then
    expect(spyCheckStatusOfSessions).toBeCalled();
    expect(spySetDuplicatePopup).toBeCalled();
  });
});
