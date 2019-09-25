/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow } from 'enzyme';
import { Browser } from './browser';
import { PopupButtons } from '../popup/popup-buttons';
import {ObjectTable} from '@mstr/rc';

describe('Browser', () => {
  it('should render empty container for filters and table of objects', () => {
    // given
    // when
    const shallowedComponentMethod = () => shallow(<Browser />);
    // then
    expect(shallowedComponentMethod).not.toThrowError();
  });
  it('should render PopupButtons', () => {
    // given
    // when
    const shallowedComponent = shallow(<Browser />);
    // then
    const wrappedPopupButtons = shallowedComponent.find(PopupButtons);
    expect(wrappedPopupButtons.length).toEqual(1);
  });
  it('should render empty ObjectTable', () => {
    // given
    // when
    const shallowedComponent = shallow(<Browser />);
    // then
    const wrappedObjectTables = shallowedComponent.find(ObjectTable);
    expect(wrappedObjectTables.length).toEqual(1);
  });
});
