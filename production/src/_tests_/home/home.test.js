import React from 'react';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import { Home, HomeNotConnected } from '../../home/home';
import { HeaderNotConnected } from '../../home/header';
import { sessionHelper } from '../../storage/session-helper';
import { reduxStore } from '../../store';
import { homeHelper } from '../../home/home-helper';
import { SettingsMenu } from '../../home/settings-menu';
import { officeStoreService } from '../../office/store/office-store-service';

jest.mock('../../storage/session-helper');
jest.mock('../../office/store/office-store-service');
jest.mock('../../home/home-helper');

describe('Home', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render home component and its children', () => {
    // given
    // when
    const componentWrapper = mount(
      <Provider store={reduxStore}>
        <Home />
      </Provider>,
    );
    // then
    expect(componentWrapper.children().length).toBeGreaterThan(0);
  });

  it('should have header component with proper text', async () => {
    // given
    const props = {
      loading: false,
      authToken: true,
      reportArray: false,
      t: (text) => text,
    };
    const tempPromise = Promise.resolve();
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'disableLoading');
    const officeHelperSpy = jest
      .spyOn(officeStoreService, 'loadExistingReportBindingsExcel')
      .mockImplementation(async () => null);
    sessionHelperSpy.mockClear();
    officeHelperSpy.mockClear();
    // when
    const componentWrapper = mount(
      <Provider store={reduxStore}>
        <HomeNotConnected {...props} />
      </Provider>,
    );
    // then
    setImmediate(() => tempPromise);
    await (tempPromise);
    const headerWrapper = componentWrapper.find('#app-header');
    expect(componentWrapper.contains(headerWrapper.get(0))).toBe(true);
    expect(officeHelperSpy).toHaveBeenCalled();
    expect(sessionHelperSpy).toHaveBeenCalled();
  });

  it('should trigger saveLoginValues and saveTokenFromCookies on mount', async () => {
    // given
    const props = {
      loading: false,
      loadingReport: false,
      authToken: false,
      reportArray: false,
    };
    const tempPromise = Promise.resolve();
    // when
    mount(<Provider store={reduxStore}><Home {...props} /></Provider>);
    // then
    await (tempPromise);
    expect(homeHelper.saveLoginValues).toBeCalled();
    expect(homeHelper.saveTokenFromCookies).toBeCalled();
  });

  it('should trigger saveTokenFromCookies on update', async () => {
    // given
    const props = {
      loading: false,
      loadingReport: false,
      authToken: false,
      reportArray: false,

    };

    const tempPromise = Promise.resolve();
    const wrappedComponent = mount(
      <Provider store={reduxStore}>
        <HomeNotConnected {...props} />
      </Provider>,
    );
    // when
    wrappedComponent.setProps({
      ...props,
      authToken: 'new',
    });
    // then
    await (tempPromise);
    expect(homeHelper.saveTokenFromCookies).toBeCalled();
  });
  describe('Header', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should properly set header values', () => {
      // given
      // when
      const headerWrapper = mount(<HeaderNotConnected />);
      // then
      expect(headerWrapper.props('userInitials')).toBeTruthy();
      expect(headerWrapper.props('userFullName')).toBeTruthy();
    });
    it('should properly set header values on localhost', () => {
      // given
      // when
      const homeWrapper = mount(
        <Provider store={reduxStore}>
          <Home />
        </Provider>,
      );
      const headerWrapper = mount(<HeaderNotConnected />);
      // then
      expect(headerWrapper.props('userInitials')).toBeTruthy();
      expect(headerWrapper.props('userFullName')).toBeTruthy();
    });
    it('should correctly render header elements', () => {
      // given

      // when
      const headerWrapper = mount(<HeaderNotConnected />);
      // then
      const imageWrapper = headerWrapper.find('#profileImage');
      const nameWrapper = headerWrapper.find('.header-name');
      const buttonWrapper = headerWrapper.find('#logOut');
      expect(imageWrapper).toBeTruthy();
      expect(nameWrapper).toBeTruthy();
      expect(buttonWrapper).toBeTruthy();
    });
    it('should correctly render profile-image in header', () => {
      // given

      // when
      const headerWrapper = mount(<HeaderNotConnected />);
      headerWrapper.setProps({ userInitials: null });
      // then
      const imageWrapper = headerWrapper.find('#profile-image');
      expect(imageWrapper).toBeTruthy();
    });
    it('should correctly render Initials in header', () => {
      // given

      // when
      const headerWrapper = mount(<HeaderNotConnected />);
      headerWrapper.setProps({ userInitials: 'n' });
      // then
      const imageWrapper = headerWrapper.find('#initials');
      expect(imageWrapper).toBeTruthy();
    });
    it('should display settings menu when isSettings flag is true', () => {
      // given
      const isSettings = true;
      // when
      const headerWrapper = shallow(<HeaderNotConnected isSettings={isSettings} />);
      // then
      expect(headerWrapper.contains(<SettingsMenu />)).toBe(true);
    });
    it('should NOT display settings menu when isSettings flag is false', () => {
      // given
      const isSettings = false;
      // when
      const headerWrapper = mount(<HeaderNotConnected isSettings={isSettings} />);
      // then
      expect(headerWrapper.contains(<SettingsMenu />)).toBe(false);
    });
    it('should change isSettings flag when button settings is clicked', () => {
      // given
      const mockToggle = jest.fn();
      const headerWrapper = mount(
        <HeaderNotConnected
          isSettings={false}
          isConfirm={false}
          toggleIsSettingsFlag={mockToggle} />
      );
      const buttonWrapper = headerWrapper.find('Button .settings-btn');
      const mockToggleSettings = jest.spyOn(headerWrapper.instance(), 'toggleSettings');
      headerWrapper.instance().forceUpdate();
      // when
      buttonWrapper.simulate('click');
      // then
      expect(mockToggleSettings).toBeCalled();
    });
    it('toggleIsSettingsFlag should be called with false when click event is registered outside of settings menu', () => {
      // given
      const map = {};
      document.addEventListener = jest.fn((event, cb) => {
        map[event] = cb;
      });
      const mockToggle = jest.fn();
      shallow(<HeaderNotConnected isSettings toggleIsSettingsFlag={mockToggle} />);
      // when
      map.click({ target: { classList: { contains: () => false, }, }, });
      // then
      expect(mockToggle).toBeCalledWith(false);
    });
    it('toggleIsSettingsFlag should be called with false when ESC keyup event is registered and settings menu is displayed', () => {
      // given
      const map = {};
      document.addEventListener = jest.fn((event, cb) => {
        map[event] = cb;
      });
      const mockToggle = jest.fn();
      shallow(<HeaderNotConnected isSettings toggleIsSettingsFlag={mockToggle} />);
      // when
      map.keyup({ keyCode: 27 });
      // then
      expect(mockToggle).toBeCalledWith(false);
    });

    it('should unregister event listeners when unmounting component', () => {
      // given
      document.removeEventListener = jest.fn();
      const headerWrapper = shallow(<HeaderNotConnected />);
      // when
      headerWrapper.unmount();
      // then
      expect(document.removeEventListener).toBeCalledTimes(2);
    });

    it('should check the event listeners if nextProps.isConfirm is true and props.isConfirm is false on shouldComponentUpdate', () => {
      // given
      const nextProps = { isConfirm: true };
      const props = { isConfirm: false };
      document.removeEventListener = jest.fn();
      document.addEventListener = jest.fn();

      const wrapper = shallow(<HeaderNotConnected {...props} />);

      // when
      wrapper.instance().shouldComponentUpdate(nextProps);
      // then
      expect(document.removeEventListener).toBeCalledTimes(2);
      expect(document.addEventListener).toBeCalled();
    });

    it('should check the event listeners if nextProps.isConfirm is false and props.isConfirm is true on shouldComponentUpdate', () => {
      // given
      const nextProps = { isConfirm: false };
      const props = { isConfirm: true };
      document.removeEventListener = jest.fn();
      document.addEventListener = jest.fn();

      const wrapper = shallow(<HeaderNotConnected {...props} />);

      // when
      wrapper.instance().shouldComponentUpdate(nextProps);
      // then
      expect(document.addEventListener).toBeCalled();
      expect(document.removeEventListener).toBeCalled();
    });
  });
});
