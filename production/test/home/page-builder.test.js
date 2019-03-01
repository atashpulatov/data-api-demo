import React from 'react';
import {mount} from 'enzyme';
import {pageBuilder} from '../../src/home/page-builder';
// TODO: get rid of Provider and reduxStore - everything should be mocked.
//  Using right now, as children components require store. They should be mocked as well
import {Provider} from 'react-redux';
import {reduxStore} from '../../src/store';


describe('PageBuilder', () => {
  it('should return page with two children as false and spinner with authentication', () => {
    // given

    // when
    const Page = () => pageBuilder.getPage(false, false, false);
    const wrappedComponent = mount(<Provider store={reduxStore}><Page /></Provider>);

    // then
    expect(wrappedComponent.find('_FileHistoryContainer').get(0)).toBeUndefined();
    expect(wrappedComponent.find('Placeholder').get(0)).toBeUndefined();
    expect(wrappedComponent.find('Spin').get(0)).toBeDefined();
    expect(wrappedComponent.find('Spin').props().children).toBeDefined();
  });

  it('should return page with one false element and Placeholder element should be defined', () => {
    // given

    // when
    const Page = () => pageBuilder.getPage(false, true, false);
    const wrappedComponent = mount(<Provider store={reduxStore}><Page /></Provider>);

    // then
    expect(wrappedComponent.find('_FileHistoryContainer').get(0)).toBeUndefined();
    expect(wrappedComponent.find('Placeholder').get(0)).toBeDefined();
  });

  it('should return page with two children as false because of non-existing auth token', () => {
    // given

    // when
    const Page = () => pageBuilder.getPage(false, false, true);
    const wrappedComponent = mount(<Provider store={reduxStore}><Page /></Provider>);

    // then
    expect(wrappedComponent.find('_FileHistoryContainer').get(0)).toBeUndefined();
    expect(wrappedComponent.find('Placeholder').get(0)).toBeUndefined();
  });

  it('should return page with one false element and Placeholder element should be defined if report is not an array', () => {
    // given

    // when
    const Page = () => pageBuilder.getPage(false, true, false);
    const wrappedComponent = mount(<Provider store={reduxStore}><Page /></Provider>);

    // then
    expect(wrappedComponent.find('_FileHistoryContainer').get(0)).toBeUndefined();
    expect(wrappedComponent.find('Placeholder').get(0)).toBeDefined();
  });

  it('should return page with one false element and 3th element should be defined if there is some reports', () => {
    // given

    // when
    const Page = () => pageBuilder.getPage(false, true, [{}]);
    const wrappedComponent = mount(<Provider store={reduxStore}><Page /></Provider>);

    // then
    expect(wrappedComponent.find('_FileHistoryContainer').get(0)).toBeDefined();
    expect(wrappedComponent.find('Placeholder').get(0)).toBeUndefined();
  });
});
