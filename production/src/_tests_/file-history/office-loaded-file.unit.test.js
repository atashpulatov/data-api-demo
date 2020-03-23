import React from 'react';
import { mount } from 'enzyme';
import { Popover } from 'antd';
import { OfficeLoadedFileNotConnected } from '../../file-history/office-loaded-file';
import { reduxStore } from '../../store';
import { fileHistoryHelper } from '../../file-history/file-history-helper';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeStoreService } from '../../office/store/office-store-service';
import { errorService } from '../../error/error-handler';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';

describe('office loaded file', () => {
  it('should display provided file name', () => {
    // given
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      fileName="test"
      refreshDate={new Date()}
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
    />);
    // then
    expect(wrappedComponent.find('div.file-history-container')).toBeTruthy();
    expect(wrappedComponent.html()).toContain('test');
  });
  it('should call componentWillUnmount provided file name', () => {
    // given
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      fileName="test"
      refreshDate={new Date()}
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
    />);
    wrappedComponent.instance().componentWillUnmount();
    // then
    expect(wrappedComponent.instance().ismounted).toBeFalsy();
  });
  it('should display dataset type icon', () => {
    // given
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(
      <OfficeLoadedFileNotConnected
        objectType={{ name: 'dataset' }}
        refreshDate={new Date()}
        visualizationInfo={visualizationInfoMock} />
    );
    const wrappedCol = wrappedComponent.find('.object-title-row');
    const wrappedIcons = wrappedCol.find('img');
    // then
    expect(wrappedCol.at(0).contains(wrappedIcons.get(0))).toBe(true);
  });
  it('should display report type icon', () => {
    // given
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(
      <OfficeLoadedFileNotConnected
        objectType={{ name: 'report' }}
        refreshDate={new Date()}
        visualizationInfo={visualizationInfoMock} />
    );
    const wrappedCol = wrappedComponent.find('.object-title-row');
    const wrappedIcons = wrappedCol.find('img');
    // then
    expect(wrappedCol.at(0).contains(wrappedIcons.get(0))).toBe(true);
  });
  it('should invoke select method on report name click', () => {
    // given
    const visualizationInfoMock = { dossierStructure: 'test' };
    const onClickMocked = jest.fn();
    const testbindId = 'testbindId';
    const testName = 'testName';
    const isCrosstab = false;
    const crosstabHeaderDimensions = false;
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      onClick={onClickMocked}
      fileName={testName}
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
      isCrosstab={isCrosstab}
      crosstabHeaderDimensions={crosstabHeaderDimensions}
    />);
    // when
    const mockDelete = jest.spyOn(wrappedComponent.instance(), 'deleteObject');
    const textWrapper = wrappedComponent.childAt(0).find('div');

    textWrapper.at(1).simulate('click');
    expect(onClickMocked).toBeCalled();
    expect(onClickMocked).toBeCalledWith(
      testbindId,
      true,
      mockDelete,
      testName,
      isCrosstab,
      crosstabHeaderDimensions
    );
  });
  it('should display delete and refresh buttons', () => {
    // given
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      fileName="test"
      refreshDate={new Date()}
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
    />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon');
    // then
    const refreshButton = wrappedIcons.at(1);
    expect(wrappedIcons.length).toBeGreaterThan(0);
    expect(refreshButton.props().type).toEqual('refresh');
    const deleteButton = wrappedIcons.at(2);
    expect(deleteButton.props().type).toEqual('trash');
  });
  it('refresh method should not do anything if in loading state', () => {
    // given
    const onRefreshMock = jest.fn();
    const startLoadingMocked = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId=""
      fileName="test"
      refreshReport={onRefreshMock}
      isLoading
      startLoading={startLoadingMocked}
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
    />);
    const refreshFunction = wrappedComponent.instance().refreshAction;
    refreshFunction(mockEvent);
    // then
    expect(onRefreshMock).not.toBeCalled();
  });
  it('refresh method should run onRefresh method', async () => {
    // given
    const onRefreshMock = jest.fn();
    const startLoadingMocked = jest.fn();
    const stopLoadingMocked = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const mockSync = jest.fn();
    const mockGetContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => ({ sync: mockSync, }));
    const mockIsCurrentSheetProtected = jest.spyOn(officeApiWorksheetHelper, 'isCurrentReportSheetProtected').mockImplementation(() => (false));
    const objectClickMock = jest.spyOn(officeApiHelper, 'onBindingObjectClick').mockImplementation(() => true);
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId=""
      fileName="test"
      refreshReportsArray={onRefreshMock}
      isLoading={false}
      startLoading={startLoadingMocked}
      stopLoading={stopLoadingMocked}
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
    />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const refreshButton = wrappedIcons.at(1);
    refreshButton.props().onClick(mockEvent);
    // then
    await expect(mockGetContext).toBeCalled();
    await expect(mockIsCurrentSheetProtected).toBeCalled();
    await expect(objectClickMock).toBeCalled();
    expect(onRefreshMock).toBeCalled();
  });
  it('should throw error if isCurrentReportSheetProtected fails refresh action', async () => {
    // given
    const onRefreshMock = jest.fn();
    const startLoadingMocked = jest.fn();
    const stopLoadingMocked = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const mockIsCurrentSheetProtected = jest.spyOn(officeApiWorksheetHelper, 'isCurrentReportSheetProtected').mockImplementation(() => { throw new Error(); });
    const mockHandleError = jest.spyOn(errorService, 'handleError').mockImplementation(() => { });
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId=""
      fileName="test"
      refreshReportsArray={onRefreshMock}
      isLoading={false}
      startLoading={startLoadingMocked}
      stopLoading={stopLoadingMocked}
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
    />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const refreshButton = wrappedIcons.at(1);
    refreshButton.props().onClick(mockEvent);
    // then
    await expect(mockIsCurrentSheetProtected).toBeCalled();
    expect(mockHandleError).toBeCalled();
  });
  it('should invoke refresh method on button click', async () => {
    // given
    const onRefreshMocked = jest.fn();
    const startLoadingMocked = jest.fn();
    const stopLoadingMocked = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const mockSync = jest.fn();
    const mockGetContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => ({ sync: mockSync, }));
    const mockIsCurrentSheetProtected = jest.spyOn(officeApiWorksheetHelper, 'isCurrentReportSheetProtected').mockImplementation(() => (false));
    const testbindId = 'testbindId';
    const objectType = { name: 'report' };
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => { });
    const objectClickMock = jest.spyOn(officeApiHelper, 'onBindingObjectClick').mockImplementation(() => true);
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      fileName="test"
      refreshReportsArray={onRefreshMocked}
      isLoading={false}
      startLoading={startLoadingMocked}
      stopLoading={stopLoadingMocked}
      objectType={objectType}
      visualizationInfo={visualizationInfoMock}
    />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const refreshButton = wrappedIcons.at(1);
    refreshButton.props().onClick(mockEvent);
    // then
    await expect(mockGetContext).toBeCalled();
    await expect(mockIsCurrentSheetProtected).toBeCalled();
    await expect(objectClickMock).toBeCalled();
    expect(onRefreshMocked).toBeCalled();
    expect(onRefreshMocked).toBeCalledWith([{ bindId: testbindId, objectType }], false);
  });
  it('should NOT invoke refresh method on button click if allowRefreshClick is false', () => {
    // given
    const onRefreshMocked = jest.fn();
    const startLoadingMocked = jest.fn();
    const stopLoadingMocked = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const testbindId = 'testbindId';
    const objectType = 'report';
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => { });
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      objectType={objectType}
      fileName="test"
      refreshReport={onRefreshMocked}
      isLoading={false}
      startLoading={startLoadingMocked}
      stopLoading={stopLoadingMocked}
      visualizationInfo={visualizationInfoMock}
    />);
    wrappedComponent.setState({ allowRefreshClick: false });
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const refreshButton = wrappedIcons.at(1);
    refreshButton.props().onClick(mockEvent);
    // then
    expect(onRefreshMocked).not.toBeCalled();
  });
  it('should display spinner when report is refreshing', () => {
    // given
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      isLoading
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
    />);
    const wrappedSpinner = wrappedComponent.find('img');
    // then
    expect(wrappedSpinner).toBeTruthy();
  });
  it('should invoke delete method on button click', async () => {
    // given
    const onDeleteMocked = jest.fn();
    const startLoadingMocked = jest.fn();
    const stopLoadingMocked = jest.fn();
    const testbindId = 'testbindId';
    const objectWorkingId = 'objectWorkingId';
    const mockEvent = { stopPropagation: jest.fn() };
    const mockSync = jest.fn();
    const mockGetContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => ({ sync: mockSync, }));
    const mockIsCurrentSheetProtected = jest.spyOn(officeApiWorksheetHelper, 'isCurrentReportSheetProtected').mockImplementation(() => (false));
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      isCrosstab
      crosstabHeaderDimensions={{}}
      fileName="test"
      onDelete={onDeleteMocked}
      startLoading={startLoadingMocked}
      stopLoading={stopLoadingMocked}
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
      objectWorkingId={objectWorkingId}
    />);
    wrappedComponent.setState({ allowDeleteClick: true });
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const deleteButton = wrappedIcons.at(2);
    deleteButton.props().onClick(mockEvent);
    // then
    await expect(mockGetContext).toBeCalled();
    await expect(mockIsCurrentSheetProtected).toBeCalled();
    expect(onDeleteMocked).toBeCalled();
    expect(onDeleteMocked).toBeCalledWith(testbindId, true, {}, objectWorkingId);
  });
  it('should throw error if isCurrentReportSheetProtected fails in delete', async () => {
    // given
    const onDeleteMocked = jest.fn();
    const startLoadingMocked = jest.fn();
    const stopLoadingMocked = jest.fn();
    const testbindId = 'testbindId';
    const mockEvent = { stopPropagation: jest.fn() };
    const mockIsCurrentSheetProtected = jest.spyOn(officeApiWorksheetHelper, 'isCurrentReportSheetProtected').mockImplementation(() => { throw new Error(); });
    const mockHandleError = jest.spyOn(errorService, 'handleError').mockImplementation(() => { });
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      isCrosstab
      crosstabHeaderDimensions={{}}
      fileName="test"
      onDelete={onDeleteMocked}
      startLoading={startLoadingMocked}
      stopLoading={stopLoadingMocked}
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
    />);
    wrappedComponent.setState({ allowDeleteClick: true });
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const deleteButton = wrappedIcons.at(2);
    deleteButton.props().onClick(mockEvent);
    // then
    await expect(mockIsCurrentSheetProtected).toBeCalled();
    expect(mockHandleError).toBeCalled();
  });
  it('should NOT invoke delete method on button click if allowDeleteClick is false', () => {
    // given
    fileHistoryHelper.deleteObject = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const testbindId = 'testbindId';
    const objectType = 'report';
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => { });
    const visualizationInfoMock = { dossierStructure: 'test' };
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      fileName="test"
      isLoading={false}
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
    />);
    wrappedComponent.setState({ allowDeleteClick: false });
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const deleteButton = wrappedIcons.at(2);
    // when
    deleteButton.props().onClick(mockEvent);
    // then
    expect(fileHistoryHelper.deleteObject).not.toBeCalled();
  });
  it('should invoke ONLY select method on button click', () => {
    // given
    const onDeleteMocked = jest.fn();
    const onClickMocked = jest.fn();
    const onRefreshMocked = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const testbindId = 'testbindId';
    const testName = 'testName';
    const visualizationInfoMock = { dossierStructure: 'test' };
    const isCrosstab = false;
    const crosstabHeaderDimensions = false;
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      onClick={onClickMocked}
      fileName={testName}
      refreshReport={onRefreshMocked}
      onDelete={onDeleteMocked}
      objectType={{ name: 'report' }}
      visualizationInfo={visualizationInfoMock}
      isCrosstab={isCrosstab}
      crosstabHeaderDimensions={crosstabHeaderDimensions}
    />);
    const mockDelete = jest.spyOn(wrappedComponent.instance(), 'deleteObject');
    const textWrapper = wrappedComponent.find('.file-history-container');
    textWrapper.props().onClick(mockEvent);
    // then
    expect(onClickMocked).toBeCalled();
    expect(onClickMocked).toBeCalledWith(
      testbindId,
      true,
      mockDelete,
      testName,
      isCrosstab,
      crosstabHeaderDimensions
    );
    expect(onDeleteMocked).not.toBeCalled();
    expect(onRefreshMocked).not.toBeCalled();
  });
  it('should contain popovers', () => {
    // given
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected fileName="test" objectType={{ name: 'report' }} visualizationInfo={visualizationInfoMock} />);
    // then
    expect(wrappedComponent.find(Popover)).toHaveLength(6);
  });
  it('should invoke edit method on button click', async () => {
    // given
    const mockSync = jest.fn();
    const mockGetContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => ({ sync: mockSync, }));
    const mockIsCurrentSheetProtected = jest.spyOn(officeApiWorksheetHelper, 'isCurrentReportSheetProtected').mockImplementation(() => (false));
    const onEditMocked = jest.fn();
    const startLoadingMocked = jest.fn();
    const mockEvent = { stopPropagation: jest.fn() };
    const testbindId = 'testbindId';
    const objectType = { name: 'report' };
    const loading = false;
    jest.spyOn(reduxStore, 'dispatch').mockImplementation(() => { });
    const objectClickMock = jest.spyOn(officeApiHelper, 'onBindingObjectClick').mockImplementation(() => true);
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      fileName="test"
      callForEdit={onEditMocked}
      isLoading={false}
      startLoading={startLoadingMocked}
      loading={loading}
      objectType={objectType}
      visualizationInfo={visualizationInfoMock}
    />);
    const wrappedIcons = wrappedComponent.find('MSTRIcon').parent();
    const editButton = wrappedIcons.at(0);
    editButton.props().onClick(mockEvent);
    // then
    await expect(mockGetContext).toBeCalled();
    await expect(mockIsCurrentSheetProtected).toBeCalled();
    await expect(objectClickMock).toBeCalled();
    expect(onEditMocked).toBeCalled();
    expect(onEditMocked).toBeCalledWith({ bindId: testbindId, objectType }, loading);
  });
  it('rename report should call officeStoreService.renameObject method when filename is given', () => {
    // given
    const givenFileName = 'name';
    const testbindId = 'testbindId';
    const objectType = { name: 'report' };
    const target = { value: givenFileName };
    const mockOfficeService = jest.spyOn(officeStoreService, 'preserveObjectValue');
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      visualizationInfo={visualizationInfoMock}
    />);
    wrappedComponent.instance().renameObject({ target });
    // then
    expect(mockOfficeService).toHaveBeenCalled();
  });
  it('should show contextual menu on right click', () => {
    // given
    const testbindId = 'testbindId';
    const objectType = { name: 'report' };
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      visualizationInfo={visualizationInfoMock}
    />);
    wrappedComponent.simulate('contextmenu', {});
    // then
    expect(wrappedComponent.exists('.ant-dropdown.ant-dropdown-hidden')).toBeFalsy();
  });
  it('should update state on setEditable', () => {
    // given
    const testbindId = 'testbindId';
    const objectType = { name: 'report' };
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      visualizationInfo={visualizationInfoMock}
    />);
    // then
    wrappedComponent.instance().setEditable(true);
    expect(wrappedComponent.state().editable).toEqual(true);
    wrappedComponent.instance().setEditable(false);
    expect(wrappedComponent.state().editable).toEqual(false);
  });
  it('should set editable and select text on enableEdit', () => {
    // given
    const event = { domEvent: { stopPropagation: jest.fn() } };
    const testbindId = 'testbindId';
    const objectType = { name: 'report' };
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      visualizationInfo={visualizationInfoMock}
    />);
    wrappedComponent.instance().enableEdit(event);
    // then
    expect(wrappedComponent.state().editable).toEqual(true);
  });
  it('should select text async', () => {
    // given

    const mockDocument = jest.spyOn(document, 'getElementById').mockImplementation(() => ({ select: jest.fn() }));
    const testbindId = 'testbindId';
    const objectType = { name: 'report' };
    const visualizationInfoMock = { dossierStructure: 'test' };
    // when
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      visualizationInfo={visualizationInfoMock}
    />);
    wrappedComponent.instance().selectTextAsync();
    // then
    setTimeout(() => {
      expect(mockDocument).toHaveBeenCalled();
    }, 150);
  });
  it('should render an input element on doubleclick', () => {
    // given
    const testbindId = 'testbindId';
    const objectType = { name: 'report' };
    const visualizationInfoMock = { dossierStructure: 'test' };
    const wrappedComponent = mount(<OfficeLoadedFileNotConnected
      refreshDate={new Date()}
      bindId={testbindId}
      objectType={objectType}
      fileName="test"
      isLoading={false}
      isPrompted
      visualizationInfo={visualizationInfoMock}
    />);
    // when
    wrappedComponent.find('.rename-container').simulate('dblclick', {});
    // then
    expect(wrappedComponent).toBeDefined();
    expect(wrappedComponent.exists(`#input-${testbindId}`)).toBeTruthy();
  });
});
