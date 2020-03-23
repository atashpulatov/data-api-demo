import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import HomeContent from '../../home/home-content';
// TODO: get rid of Provider and reduxStore - everything should be mocked.
//  Using right now, as children components require store. They should be mocked as well
import { reduxStore } from '../../store';
import { sessionHelper } from '../../storage/session-helper';


describe('PageBuilder', () => {
  it('should return page with two children as false and spinner with authentication', () => {
    // given
    const givenProps = {
      loading: false,
      loadingReport: false,
      authToken: false,
      reportArray: [],
      popupOpen: false,
      shouldRenderSettings: false,
      toggleRenderSettingsFlag: false,
      t: (t) => t,
    };

    // when
    const wrappedComponent = mount(<Provider store={reduxStore}><HomeContent {...givenProps} /></Provider>);

    // then
    expect(wrappedComponent.find('FileHistoryContainerNotConnected').get(0)).toBeUndefined();
    expect(wrappedComponent.find('PlaceHolderNotConnected').get(0)).toBeUndefined();
    expect(wrappedComponent.find('Spin').get(0)).toBeDefined();
    expect(wrappedComponent.find('Spin').props().children).toBeDefined();
  });

  it('should return page with one false element and Placeholder element should be defined', () => {
    // given
    const givenProps = {
      loading: false,
      loadingReport: false,
      authToken: true,
      reportArray: [],
      popupOpen: false,
      shouldRenderSettings: false,
      toggleRenderSettingsFlag: false,
      t: (t) => t,
    };

    // when
    const wrappedComponent = mount(<Provider store={reduxStore}><HomeContent {...givenProps} /></Provider>);

    // then
    expect(wrappedComponent.find('FileHistoryContainerNotConnected').get(0)).toBeUndefined();
    expect(wrappedComponent.find('PlaceHolderNotConnected').get(0)).toBeDefined();
  });

  it('should return page with two children as false because of non-existing auth authToken', () => {
    // given
    const givenProps = {
      loading: true,
      loadingReport: true,
      authToken: false,
      reportArray: [],
      popupOpen: false,
      shouldRenderSettings: false,
      toggleRenderSettingsFlag: false,
      t: (t) => t,
    };

    // when
    const wrappedComponent = mount(<Provider store={reduxStore}><HomeContent {...givenProps} /></Provider>);

    // then
    expect(wrappedComponent.find('FileHistoryContainerNotConnected').get(0)).toBeUndefined();
    expect(wrappedComponent.find('PlaceHolderNotConnected').get(0)).toBeUndefined();
  });

  it('should return page with one false element and Placeholder element should be defined if report is not an array', () => {
    // given
    const givenProps = {
      loading: false,
      loadingReport: false,
      authToken: true,
      reportArray: [],
      popupOpen: false,
      shouldRenderSettings: false,
      toggleRenderSettingsFlag: false,
      t: (t) => t,
    };
    // when
    const wrappedComponent = mount(<Provider store={reduxStore}><HomeContent {...givenProps} /></Provider>);

    // then
    expect(wrappedComponent.find('FileHistoryContainerNotConnected').get(0)).toBeUndefined();
    expect(wrappedComponent.find('PlaceHolderNotConnected').get(0)).toBeDefined();
  });

  it('should return page with one false element and 3th element should be defined if there is some reports', () => {
    // given
    const givenProps = {
      loading: false,
      loadingReport: false,
      authToken: true,
      reportArray: [{}],
      popupOpen: false,
      shouldRenderSettings: false,
      toggleRenderSettingsFlag: false,
      t: (t) => t,
    };
    // when
    const wrappedComponent = mount(<Provider store={reduxStore}><HomeContent {...givenProps} /></Provider>);

    // then
    expect(wrappedComponent.find('FileHistoryContainerNotConnected').get(0)).toBeDefined();
    expect(wrappedComponent.find('PlaceHolderNotConnected').get(0)).toBeUndefined();
  });
  it('should return page with a home dialog component when the popup is open', () => {
    // given
    const givenProps = {
      loading: false,
      loadingReport: false,
      authToken: true,
      reportArray: [{}],
      popupOpen: true,
      shouldRenderSettings: false,
      toggleRenderSettingsFlag: false,
      t: (t) => t,
    };
    // when
    const wrappedComponent = mount(<Provider store={reduxStore}><HomeContent {...givenProps} /></Provider>);

    // then
    expect(wrappedComponent.find('FileHistoryContainerNotConnected').get(0)).toBeDefined();
    expect(wrappedComponent.find('.dialog-container').get(0)).toBeDefined();
  });
  it('should disable logout and add data buttons while loading a report', () => {
    // given
    const givenProps = {
      loading: false,
      loadingReport: true,
      authToken: true,
      reportArray: [{}],
      popupOpen: false,
      shouldRenderSettings: false,
      toggleRenderSettingsFlag: false,
      t: (t) => t,
    };
    jest.spyOn(sessionHelper, 'isDevelopment').mockImplementationOnce(() => false);
    // when
    const wrappedComponent = mount(<Provider store={reduxStore}><HomeContent {...givenProps} /></Provider>);

    // then
    expect(wrappedComponent.find('FileHistoryContainerNotConnected').get(0)).toBeDefined();
    expect(wrappedComponent.find('.ant-btn[disabled]')).toHaveLength(2);
  });
  it('should disable logout and add data buttons while a popup is open', () => {
    // given
    const givenProps = {
      loading: false,
      loadingReport: false,
      authToken: true,
      reportArray: [{}],
      popupOpen: true,
      shouldRenderSettings: false,
      toggleRenderSettingsFlag: false,
      t: (t) => t,
    };
    jest.spyOn(sessionHelper, 'isDevelopment').mockImplementationOnce(() => false);
    // when
    const wrappedComponent = mount(<Provider store={reduxStore}><HomeContent {...givenProps} /></Provider>);

    // then
    expect(wrappedComponent.find('FileHistoryContainerNotConnected').get(0)).toBeDefined();
    expect(wrappedComponent.find('.dialog-container').get(0)).toBeDefined();
    expect(wrappedComponent.find('.ant-btn[disabled]')).toHaveLength(2);
  });
  it('should disable settings and add data buttons while a popup is open and a report is loading', () => {
    // given
    const givenProps = {
      loading: false,
      loadingReport: true,
      authToken: true,
      reportArray: [{}],
      popupOpen: true,
      shouldRenderSettings: false,
      toggleRenderSettingsFlag: false,
      t: (t) => t,
    };
    jest.spyOn(sessionHelper, 'isDevelopment').mockImplementationOnce(() => false);
    // when
    const wrappedComponent = mount(<Provider store={reduxStore}><HomeContent {...givenProps} /></Provider>);

    // then
    expect(wrappedComponent.find('FileHistoryContainerNotConnected').get(0)).toBeDefined();
    expect(wrappedComponent.find('.dialog-container').get(0)).toBeDefined();
    expect(wrappedComponent.find('.ant-btn[disabled]')).toHaveLength(2);
  });
});
