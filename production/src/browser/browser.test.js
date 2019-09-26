/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow } from 'enzyme';
import { ObjectTable } from '@mstr/rc';
import { _Browser } from './browser';
import { PopupButtons } from '../popup/popup-buttons';
import { reportsExample } from './objects';
import { projectsExample } from './projects';

describe('Browser', () => {
  const mockedProps = {
    objects: reportsExample.result,
    projects: projectsExample,
    onSortChange: () => { },
    selected: {
      id: '02DDEFDA460B58681B005AAB4A1CBFD3',
      projectId: 'CE52831411E696C8BD2F0080EFD5AF44',
    },
    onSelect: () => { },
  };

  it('should render empty container for filters and table of objects', () => {
    // given
    // when
    const shallowedComponentMethod = () => shallow(<_Browser />);
    // then
    expect(shallowedComponentMethod).not.toThrowError();
  });
  it('should render PopupButtons', () => {
    // given
    // when
    const shallowedComponent = shallow(<_Browser />);
    // then
    const wrappedPopupButtons = shallowedComponent.find(PopupButtons);
    expect(wrappedPopupButtons.length).toEqual(1);
  });
  it('should render empty ObjectTable', () => {
    // given
    // when
    const shallowedComponent = shallow(<_Browser />);
    // then
    const wrappedObjectTables = shallowedComponent.find(ObjectTable);
    expect(wrappedObjectTables.length).toEqual(1);
  });
  it('should render with proper props passed', () => {
    // given
    // when
    const shallowedComponent = shallow(<_Browser {...mockedProps} />);
    // then
    expect(shallowedComponent).toMatchSnapshot();
  });

  it('should plug the methods to ObjectTable', () => {
    // given
    const onSortChange = jest.fn();
    const onSelect = jest.fn();
    // when
    const shallowedComponent = shallow(<_Browser {...mockedProps} onSortChange={onSortChange} onSelect={onSelect} />);
    // then
    const wrappedObjectTables = shallowedComponent.find(ObjectTable);
    expect(wrappedObjectTables.prop('onSortChange')).toBe(onSortChange);
    expect(wrappedObjectTables.prop('onSelect')).toBe(onSelect);
  });
});
