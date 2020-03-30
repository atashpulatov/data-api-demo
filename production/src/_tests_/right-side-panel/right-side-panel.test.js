import React from 'react';
import { shallow, mount } from 'enzyme';
import { SidePanel } from '@mstr/rc/';
import { RightSidePanelNotConnected } from '../../right-side-panel/right-side-panel';
import { SettingsMenu } from '../../home/settings-menu';
import { popupController } from '../../popup/popup-controller';
import { errorService } from '../../error/error-handler';
import { officeStoreService } from '../../office/store/office-store-service';

describe('RightSidePanelNotConnected', () => {
  const mockedProps = { loadedObjects: [], cancelCurrentImportRequest: jest.fn() };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call toggleSecureFlag if file is secured', () => {
    // given
    const toggleSecuredFlagMock = jest.fn();
    const mockToggleStoreFlag = jest.spyOn(officeStoreService, 'isFileSecured').mockImplementation(() => true);
    // when
    const shallowedComponent = mount(
      <RightSidePanelNotConnected {...mockedProps} toggleSecuredFlag={toggleSecuredFlagMock} />
    );
    // then
    expect(toggleSecuredFlagMock).toBeCalledWith(true);
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
  it('should cancel current import on add data', () => {
    // given
    const shallowedComponent = shallow(<RightSidePanelNotConnected {...mockedProps} />);
    const shallowedSidePanel = shallowedComponent.find(SidePanel).at(0);
    const methodToTest = shallowedSidePanel.prop('onAddData');
    // when
    methodToTest();
    // then
    expect(mockedProps.cancelCurrentImportRequest).toBeCalled();
  });
  it('should call runPopupNavigation on add data', () => {
    // given
    const shallowedComponent = shallow(<RightSidePanelNotConnected {...mockedProps} />);
    const shallowedSidePanel = shallowedComponent.find(SidePanel).at(0);
    const methodToTest = shallowedSidePanel.prop('onAddData');
    const runPopupNavigationSpy = jest.spyOn(popupController, 'runPopupNavigation');
    // when
    methodToTest();
    // then
    expect(runPopupNavigationSpy).toBeCalled();
  });
  it('should errorService if error is thrown', () => {
    // given
    const shallowedComponent = shallow(<RightSidePanelNotConnected {...mockedProps} />);
    const errorToThrow = new Error('Something wrong');
    const shallowedSidePanel = shallowedComponent.find(SidePanel).at(0);
    const methodToTest = shallowedSidePanel.prop('onAddData');
    jest.spyOn(popupController, 'runPopupNavigation').mockImplementationOnce(() => { throw errorToThrow; });
    const handleErrorSpy = jest.spyOn(errorService, 'handleError');
    // when
    methodToTest();
    // then
    expect(handleErrorSpy).toBeCalled();
    expect(handleErrorSpy).toBeCalledWith(errorToThrow);
  });
  it('should provide settingsMenu to SidePanel when isSettings is true', () => {
    // given
    // when
    const wrappedComponent = mount(<RightSidePanelNotConnected {...mockedProps} isSettings />);
    // then
    const wrappedSidePanel = wrappedComponent.find(SidePanel).at(0);
    expect(wrappedSidePanel.props()).toBe('aaa');
  });
});
