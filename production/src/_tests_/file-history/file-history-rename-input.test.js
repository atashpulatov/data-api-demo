import React from 'react';
import { shallow, mount } from 'enzyme';
import { Popover } from 'antd';
import { RenameInputNotConnected } from '../../file-history/file-history-rename-input';
import { OfficeLoadedFileNotConnected } from '../../file-history/office-loaded-file';


describe('File history rename input', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render a div element with defined name', () => {
    // given
    const givenFileName = 'name';
    const bindingId = 'id123';
    // when
    const wrappedComponent = shallow(<RenameInputNotConnected fileName={givenFileName} bindingId={bindingId} />);

    // then
    expect(wrappedComponent).toBeDefined();
    expect(wrappedComponent.exists(`#rename-container-${bindingId}`)).toBeTruthy();
  });

  it('should call enableEdit on doubleclick', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    const onClickMocked = jest.fn();
    const testBindingId = 'testBindingId';
    const testName = 'testName';
    const visualizationInfoMock = { dossierStructure: 'test', };
    const wrap = mount(<OfficeLoadedFileNotConnected

      refreshDate={new Date()}
      bindingId={testBindingId}
      onClick={onClickMocked}
      fileName={testName}
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
    />);
    // when
    const enableEdit = jest.spyOn(wrap.instance(), 'enableEdit');
    // when
    const wrappedComponent = mount(<RenameInputNotConnected fileName={givenFileName} bindingId={givenId} enableEdit={enableEdit} />);
    wrappedComponent.find('.rename-container').simulate('dblclick', {});
    // then
    expect(enableEdit).toBeCalled();
  });

  it('should contain popover', () => {
    // given
    const givenFileName = 'name';
    const givenId = 'id123';
    // when
    const wrappedComponent = mount(<RenameInputNotConnected fileName={givenFileName} bindingId={givenId} />);
    // then
    expect(wrappedComponent.find(Popover)).toHaveLength(1);
  });
});
