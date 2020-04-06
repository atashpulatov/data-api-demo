import React from 'react';
import { connect } from 'react-redux';
import { MSTRIcon } from '@mstr/mstr-react-library';
import { withTranslation } from 'react-i18next';
import { Dropdown, Menu } from 'antd';
import PropTypes from 'prop-types';
import { fileHistoryHelper } from './file-history-helper';
import loadingSpinner from './assets/report_loading_spinner.gif';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import RenameInput from './file-history-rename-input';
import { officeApiHelper } from '../office/api/office-api-helper';
import { ButtonPopover } from './button-popover';
import datasetIcon from './assets/icon_Dataset_32.png';
import dossierIcon from './assets/icon_Dossier_32.png';
import reportIcon from './assets/icon_Report_blue_32.png';
import { ReactComponent as ClockIcon } from './assets/icon_clock.svg';
import officeStoreObject from '../office/store/office-store-object';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import {
  startLoading as startLoadingImported,
  stopLoading as stopLoadingImported
} from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { errorService } from '../error/error-handler';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';

export class OfficeLoadedFileNotConnected extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allowDeleteClick: true,
      allowRefreshClick: true,
      editable: false,
      value: props.fileName,
    };
  }

  componentDidMount() {
    this.ismounted = true;
  }

  componentWillUnmount() {
    this.ismounted = false;
  }

  renameObject = async ({ target }) => {
    const { bindId, fileName } = this.props;
    const newName = target.value || fileName;
    this.setState({ value: newName });
    if (newName && bindId) {
      await officeStoreObject.modifyObjectValue(bindId, 'name', newName);
    }
    this.setEditable(false);
  };

  selectTextAsync = (id) => {
    // TODO: Timeout hardcoded value, without it cannot select text of the input
    setTimeout(() => {
      /* istanbul ignore next */
      document.getElementById(id).select();
    }, 100);
  };

  setEditable = (editable) => {
    this.setState({ editable });
  }

  enableEdit = (e) => {
    if (e.domEvent) { e.domEvent.stopPropagation(); }
    const { bindId } = this.props;
    this.selectTextAsync(`input-${bindId}`);
    this.setEditable(true);
  }


  copyValue = (e) => {
    const { value } = this.state;
    e.domEvent.stopPropagation();
    const text = document.createElement('textarea');
    text.value = value;
    document.body.appendChild(text);
    text.select();
    document.execCommand('copy');
    document.body.removeChild(text);
  }


  deleteObject = async () => {
    const {
      onDelete, bindId, isCrosstab, crosstabHeaderDimensions, fileName, t, objectWorkingId
    } = this.props;

    const message = t('{{name}} has been removed from the workbook.', { name: fileName });
    await fileHistoryHelper.deleteObject(
      onDelete,
      bindId,
      isCrosstab,
      crosstabHeaderDimensions,
      objectWorkingId,
      message
    );
  }

  deleteAction = (e) => {
    const { allowDeleteClick } = this.state;
    const {
      t, loading, startLoading, stopLoading
    } = this.props;
    if (e) { e.stopPropagation(); }
    if (!allowDeleteClick || loading) {
      return;
    }
    startLoading();
    const {
      onDelete, bindId, isCrosstab, crosstabHeaderDimensions, fileName, objectWorkingId
    } = this.props;

    this.setState({ allowDeleteClick: false, allowRefreshClick: false },
      async () => {
        try {
          const excelContext = await officeApiHelper.getExcelContext();
          await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);
          const message = t('{{name}} has been removed from the workbook.', { name: fileName });

          await fileHistoryHelper.deleteObject(
            onDelete,
            bindId,
            isCrosstab,
            crosstabHeaderDimensions,
            objectWorkingId,
            message
          );
          if (this.ismounted) { this.setState({ allowDeleteClick: true, allowRefreshClick: true }); }
          stopLoading();
        } catch (error) {
          errorService.handleError(error);
        } finally {
          stopLoading();
          this.setState({ allowDeleteClick: true, allowRefreshClick: true });
        }
      });
  };

  editAction = (e) => {
    const { allowRefreshClick } = this.state;
    const {
      isLoading, bindId, objectType, callForEdit, fileName,
      loading, startLoading, stopLoading, callForEditDossier
    } = this.props;

    if (e) { e.stopPropagation(); }
    if (!allowRefreshClick || loading) {
      return;
    }
    startLoading();

    if (!isLoading) {
      this.setState({ allowRefreshClick: false }, async () => {
        try {
          const excelContext = await officeApiHelper.getExcelContext();
          await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);

          if (await officeApiHelper.onBindingObjectClick(bindId, false, this.deleteObject, fileName)) {
            if (objectType.name === mstrObjectEnum.mstrObjectType.visualization.name) {
              (await callForEditDossier({ bindId, objectType }, loading));
            } else {
              (await callForEdit({ bindId, objectType }, loading));
            }
          }
        } catch (error) {
          errorService.handleError(error);
        } finally {
          stopLoading();
          this.setState({ allowRefreshClick: true });
        }
      });
    }
  };

  refreshAction = (e) => {
    if (e) { e.stopPropagation(); }
    const {
      isLoading, bindId, objectType, refreshReportsArray,
      loading, fileName, startLoading, stopLoading
    } = this.props;

    const { allowRefreshClick } = this.state;
    if (!allowRefreshClick || loading) {
      return;
    }

    startLoading();

    if (!isLoading) {
      this.setState({ allowRefreshClick: false }, async () => {
        try {
          const excelContext = await officeApiHelper.getExcelContext();

          await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext, bindId);
          if (await officeApiHelper.onBindingObjectClick(bindId, false, this.deleteObject, fileName)) {
            (await refreshReportsArray([{ bindId, objectType }], false));
          }
        } catch (error) {
          errorService.handleError(error);
        } finally {
          this.setState({ allowRefreshClick: true });
          stopLoading();
        }
      });
    }
  };

  getMstrIcon = (objectType) => {
    const { t } = this.props;
    switch (objectType.name) {
      case mstrObjectEnum.mstrObjectType.report.name:
        return (
          <ButtonPopover
            placement="bottom"
            content={t('Report')}
            mouseEnterDelay={1}
          >
            <span>
              <img src={reportIcon} alt={t('report icon')} />
            </span>
          </ButtonPopover>
        );
      case mstrObjectEnum.mstrObjectType.dataset.name:
        return (
          <ButtonPopover
            placement="bottom"
            content={t('Dataset')}
            mouseEnterDelay={1}
          >
            <span>
              <img src={datasetIcon} alt={t('dataset icon')} />
            </span>
          </ButtonPopover>
        );
      case mstrObjectEnum.mstrObjectType.visualization.name:
        return (
          <ButtonPopover
            placement="bottom"
            content={t('Dossier')}
            mouseEnterDelay={1}
          >
            <span>
              <img src={dossierIcon} alt={t('dossier icon')} />
            </span>
          </ButtonPopover>
        );
      default:
        break;
    }
    return <></>;
  };

  renderIcons({ t, isLoading }) {
    return (
      <span className="object-icons">
        <ButtonPopover
          placement="bottom"
          content={t('Edit Data')}
          mouseEnterDelay={1}
        >
          <span
            aria-label={t('Edit button')}
            role="button"
            tabIndex="0"
            className="loading-button-container"
            onClick={this.editAction}
            onKeyUp={this.editAction}
          >
            <MSTRIcon type="edit" />
          </span>
        </ButtonPopover>
        <ButtonPopover
          placement="bottom"
          content={t('Refresh Data')}
          mouseEnterDelay={1}
        >
          <span
            aria-label={t('Refresh button')}
            role="button"
            tabIndex="0"
            className="loading-button-container"
            onClick={this.refreshAction}
            onKeyUp={this.refreshAction}
          >
            {!isLoading ? (
              <MSTRIcon type="refresh" />
            ) : (
              <img
                id="report-loading-icon"
                width="12px"
                height="12px"
                src={loadingSpinner}
                alt={t('Report loading icon')}
              />
            )}
          </span>
        </ButtonPopover>
        <ButtonPopover
          placement="bottomRight"
          content={t('Remove Data from Workbook')}
          mouseEnterDelay={1}
          arrowPointAtCenter="true"
        >
          <span
            aria-label={t('Delete button')}
            role="button"
            tabIndex="0"
            onClick={this.deleteAction}
            onKeyUp={this.deleteAction}
          >
            <MSTRIcon type="trash" />
          </span>
        </ButtonPopover>
      </span>
    );
  }


  render() {
    const {
      fileName,
      bindId,
      onClick,
      isLoading,
      objectType,
      refreshDate,
      t,
      visualizationInfo = false,
      isCrosstab,
      crosstabHeaderDimensions,
    } = this.props;
    const { dossierStructure = false } = visualizationInfo;
    const { editable } = this.state;
    let { value } = this.state;
    const { dossierName, chapterName, pageName } = dossierStructure;
    const isVisualization = (objectType.name === mstrObjectEnum.mstrObjectType.visualization.name);
    const menu = (
      <Menu>
        <Menu.Item key="edit" onClick={(e) => { e.domEvent.stopPropagation(); this.editAction(); }}>{t('Edit')}</Menu.Item>
        <Menu.Item key="refresh" onClick={(e) => { e.domEvent.stopPropagation(); this.refreshAction(); }}>{t('Refresh')}</Menu.Item>
        <Menu.Item key="remove" onClick={(e) => { e.domEvent.stopPropagation(); this.deleteAction(); }}>{t('Remove')}</Menu.Item>
        <Menu.Item key="rename" onClick={this.enableEdit}>{t('Rename')}</Menu.Item>
        <Menu.Item key="copy" onClick={this.copyValue}>{t('Copy Name')}</Menu.Item>
      </Menu>
    );
    // If fileName was changed but it was not introduced by user in editable mode
    // (so fetched during edit) then update value to new fileName.
    if (!editable && (fileName !== value)) { value = fileName; }
    return (
      <Dropdown overlay={menu} trigger={['contextMenu']}>
        <div
          className="file-history-container"
          type="flex"
          justify="center"
          role="button"
          tabIndex="0"
          onClick={() => onClick(bindId, true, this.deleteObject, fileName, isCrosstab, crosstabHeaderDimensions)}
          onKeyUp={(e) => e.key === 'Enter' && onClick(bindId, true, this.deleteObject, fileName, isCrosstab, crosstabHeaderDimensions)}
        >
          <div className="refresh-icons-row">
            <ButtonPopover
              placement="bottom"
              content={t('Date and time of last modification')}
              mouseEnterDelay={1}
            >
              <span className="additional-data-wrapper">
                <ClockIcon />
                <span className="additional-data">
                  {t('refreshed_date', { date: refreshDate })}
                </span>
              </span>
            </ButtonPopover>
            {this.renderIcons({ t, isLoading })}
          </div>


          {isVisualization && dossierStructure
            && (
              <ButtonPopover
                placement="bottom"
                content={`${dossierName} > ${chapterName} > ${pageName}`}
                mouseEnterDelay={1}>
                <div className="visualization-path-row">{`${dossierName} > ${chapterName} > ${pageName}`}</div>
              </ButtonPopover>
            )}

          <div className="object-title-row">
            {this.getMstrIcon(objectType)}
            <RenameInput
              bindId={bindId}
              fileName={fileName}
              editable={editable}
              value={value}
              enableEdit={this.enableEdit}
              handleChange={this.handleChange}
              renameObject={this.renameObject} />
          </div>
        </div>
      </Dropdown>
    );
  }
}

OfficeLoadedFileNotConnected.defaultProps = { t: (text) => text, };

function mapStateToProps(state) {
  return { loading: state.officeReducer.loading, };
}

const mapDispatchToProps = {
  refreshReportsArray: popupActions.refreshReportsArray,
  callForEdit: popupActions.callForEdit,
  callForEditDossier: popupActions.callForEditDossier,
  startLoading: startLoadingImported,
  stopLoading: stopLoadingImported,
};

OfficeLoadedFileNotConnected.propTypes = {
  objectWorkingId: PropTypes.number,
  fileName: PropTypes.string,
  bindId: PropTypes.string,
  objectType: PropTypes.shape({ name: PropTypes.string }),
  loading: PropTypes.bool,
  isLoading: PropTypes.bool,
  isCrosstab: PropTypes.bool,
  visualizationInfo: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
  crosstabHeaderDimensions: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
  refreshDate: PropTypes.instanceOf(Date),
  startLoading: PropTypes.func,
  stopLoading: PropTypes.func,
  refreshReportsArray: PropTypes.func,
  t: PropTypes.func,
  onDelete: PropTypes.func,
  callForEdit: PropTypes.func,
  callForEditDossier: PropTypes.func,
  onClick: PropTypes.func,
};

export const OfficeLoadedFile = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(OfficeLoadedFileNotConnected));
