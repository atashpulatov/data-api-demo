import React from 'react';
import { connect } from 'react-redux';
import { MSTRIcon } from '@mstr/mstr-react-library';
import { withTranslation } from 'react-i18next';
import { Dropdown, Menu } from 'antd';
import { fileHistoryHelper } from './file-history-helper';
import loadingSpinner from './assets/report_loading_spinner.gif';
import {
  refreshReportsArray,
  callForEdit,
  callForReprompt,
} from '../popup/popup-actions';
import RenameInput from './file-history-rename-input';
import { officeApiHelper } from '../office/office-api-helper';
import { ButtonPopover } from './button-popover';
import { ReactComponent as DossierIcon } from './assets/icon_Dossier.svg';
import { ReactComponent as ClockIcon } from './assets/icon_clock.svg';
import { officeStoreService } from '../office/store/office-store-service';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum.js';

export class _OfficeLoadedFile extends React.Component {
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
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  renameReport = /* istanbul ignore next */ async ({ target }) => {
    const { bindingId, fileName } = this.props;
    const newName = target.value || fileName;
    this.setState({ value: newName });
    if (newName && bindingId) await officeStoreService.preserveReportValue(bindingId, 'name', newName);
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
    if (e.domEvent) e.domEvent.stopPropagation();
    const { bindingId } = this.props;
    this.selectTextAsync(`input-${bindingId}`);
    this.setEditable(true);
  }


  copyValue = /* istanbul ignore next */ (e) => {
    const { value } = this.state;
    e.domEvent.stopPropagation();
    const text = document.createElement('textarea');
    text.value = value;
    document.body.appendChild(text);
    text.select();
    document.execCommand('copy');
    document.body.removeChild(text);
  }

  deleteReport = async () => {
    const {
      onDelete, bindingId, isCrosstab, crosstabHeaderDimensions, fileName, t,
    } = this.props;
    const message = t('{{name}} has been removed from the workbook.', { name: fileName });
    await fileHistoryHelper.deleteReport(onDelete,
      bindingId,
      isCrosstab,
      crosstabHeaderDimensions,
      message);
  }

  deleteAction = (e) => {
    const { allowDeleteClick } = this.state;
    const { t } = this.props;
    if (e) e.stopPropagation();
    if (!allowDeleteClick) {
      return;
    }
    const {
      onDelete,
      bindingId,
      isCrosstab,
      crosstabHeaderDimensions,
      fileName,
    } = this.props;
    this.setState({ allowDeleteClick: false, allowRefreshClick: false },
      async () => {
        const message = t('{{name}} has been removed from the workbook.',
          { name: fileName });
        await fileHistoryHelper.deleteReport(onDelete,
          bindingId,
          isCrosstab,
          crosstabHeaderDimensions,
          message);
        if (this._ismounted) this.setState({ allowDeleteClick: true, allowRefreshClick: true });
      });
  };

  repromptAction = (e) => {
    const { allowRefreshClick } = this.state;
    if (e) e.stopPropagation();
    if (!allowRefreshClick) {
      return;
    }
    const {
      isLoading, bindingId, objectType, callForReprompt, fileName,
    } = this.props;
    if (!isLoading) {
      this.setState({ allowRefreshClick: false }, async () => {
        try {
          // calling onBindingObjectClick to check whether the object exists in Excel
          // before opening prompt popup
          if (await officeApiHelper.onBindingObjectClick(bindingId, false, this.deleteReport, fileName)) {
            await callForReprompt({ bindId: bindingId, objectType });
          }
        } finally {
          this.setState({ allowRefreshClick: true });
        }
      });
    }
  };

  editAction = (e) => {
    const { allowRefreshClick } = this.state;
    if (e) e.stopPropagation();
    if (!allowRefreshClick) {
      return;
    }
    const {
      isLoading, bindingId, objectType, callForEdit, fileName,
    } = this.props;
    if (!isLoading) {
      this.setState({ allowRefreshClick: false }, async () => {
        try {
          // calling onBindingObjectClick to check whether the object exists in Excel
          // before opening edit data popup
          if (await officeApiHelper.onBindingObjectClick(bindingId, false, this.deleteReport, fileName)) {
            (await callForEdit({ bindId: bindingId, objectType }));
          }
        } finally {
          this.setState({ allowRefreshClick: true });
        }
      });
    }
  };

  refreshAction = (e) => {
    if (e) e.stopPropagation();
    const { isLoading, bindingId, objectType, refreshReportsArray, loading, fileName } = this.props;
    const { allowRefreshClick } = this.state;
    if (!allowRefreshClick || loading) {
      return;
    }
    if (!isLoading) {
      this.setState({ allowRefreshClick: false }, async () => {
        try {
          if (await officeApiHelper.onBindingObjectClick(bindingId, false, this.deleteReport, fileName)) {
            (await refreshReportsArray([{ bindId: bindingId, objectType }], false));
          }
        } finally {
          this.setState({ allowRefreshClick: true });
        }
      });
    }
  };

  getMstrIcon = (objectType) => {
    switch (objectType.name) {
      case mstrObjectEnum.mstrObjectType.report.name:
        return <MSTRIcon type="report" />;
      case mstrObjectEnum.mstrObjectType.dataset.name:
        return <MSTRIcon type="dataset" />;
      case mstrObjectEnum.mstrObjectType.visualization.name:
        return <DossierIcon />;
      default:
        break;
    }
    return <></>;
  };

  renderIcons(t, isPrompted, isLoading) {
    return (
      <span className="object-icons">
        <ButtonPopover
          placement="bottom"
          content={t('Reprompt')}
          mouseEnterDelay={1}
        >
          {!!isPrompted && (
            <span
              role="button"
              tabIndex="0"
              className="loading-button-container"
              onClick={this.repromptAction}
              onKeyPress={this.repromptAction}
            >
              <MSTRIcon type="reprompt" />
            </span>
          )}
        </ButtonPopover>
        <ButtonPopover
          placement="bottom"
          content={t('Edit Data')}
          mouseEnterDelay={1}
        >
          {
            <span
              role="button"
              tabIndex="0"
              className="loading-button-container"
              onClick={this.editAction}
              onKeyPress={this.editAction}
            >
              <MSTRIcon type="edit" />
            </span>
          }
        </ButtonPopover>
        <ButtonPopover
          placement="bottom"
          content={t('Refresh Data')}
          mouseEnterDelay={1}
        >
          {
            <span
              role="button"
              tabIndex="0"
              className="loading-button-container"
              onClick={this.refreshAction}
              onKeyPress={this.refreshAction}
            >
              {!isLoading ? (
                <MSTRIcon type="refresh" />
              ) : (
                <img
                    width="12px"
                    height="12px"
                    src={loadingSpinner}
                    alt={t('Report loading icon')}
                  />
              )}
            </span>
          }
        </ButtonPopover>
        <ButtonPopover
          placement="bottomRight"
          content={t('Remove Data from Workbook')}
          mouseEnterDelay={1}
          arrowPointAtCenter="true"
        >
          <span
            role="button"
            tabIndex="0"
            onClick={this.deleteAction}
            onKeyPress={this.deleteAction}
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
      bindingId,
      onClick,
      isLoading,
      objectType,
      isPrompted,
      refreshDate,
      t,
      visualizationInfo = false,
    } = this.props;
    const { dossierStructure = false } = visualizationInfo;
    const { editable, value } = this.state;
    const { dossierName, chapterName, pageName } = dossierStructure;
    const menu = (
      <Menu>
        {isPrompted && <Menu.Item key="reprompt" onClick={(e) => { e.domEvent.stopPropagation(); this.repromptAction(); }}>{t('Reprompt')}</Menu.Item>}
        <Menu.Item key="edit" onClick={(e) => { e.domEvent.stopPropagation(); this.editAction(); }}>{t('Edit')}</Menu.Item>
        <Menu.Item key="refresh" onClick={(e) => { e.domEvent.stopPropagation(); this.refreshAction(); }}>{t('Refresh')}</Menu.Item>
        <Menu.Item key="remove" onClick={(e) => { e.domEvent.stopPropagation(); this.deleteAction(); }}>{t('Remove')}</Menu.Item>
        <Menu.Item key="rename" onClick={this.enableEdit}>{t('Rename')}</Menu.Item>
        <Menu.Item key="copy" onClick={this.copyValue}>{t('Copy')}</Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} trigger={['contextMenu']}>
        <div
          className="file-history-container"
          type="flex"
          justify="center"
          role="listitem"
          tabIndex="0"
          onClick={() => onClick(bindingId, true, this.deleteReport, fileName)}
        >
          <div className="refresh-icons-row">
            <ButtonPopover
              placement="bottom"
              content={t('Date and time of last modification')}
              mouseEnterDelay={1}
            >
              <span>
                <ClockIcon style={{ marginBottom: '2px' }} />
                <span className="additional-data">
                  {t('refreshed_date', { date: refreshDate })}
                </span>
              </span>
            </ButtonPopover>
            {this.renderIcons(t, isPrompted, isLoading)}
          </div>


          {objectType.name === mstrObjectEnum.mstrObjectType.visualization.name && dossierStructure
            && (
              <ButtonPopover
                placement="bottom"
                content={`${dossierName} > ${chapterName} > ${pageName}`}
                mouseEnterDelay={1}>
                <div className="visualisation-path-row">{`${dossierName} > ${chapterName} > ${pageName}`}</div>
              </ButtonPopover>
            )}

          <div className="object-title-row">
            {<span>{this.getMstrIcon(objectType)}</span>}
            <RenameInput bindingId={bindingId} fileName={fileName} editable={editable} value={value} enableEdit={this.enableEdit} handleChange={this.handleChange} renameReport={this.renameReport} />
          </div>
        </div>
      </Dropdown>
    );
  }
}

_OfficeLoadedFile.defaultProps = {
  t: (text) => text,
};

function mapStateToProps(state) {
  return {
    loading: state.officeReducer.loading,
  };
}

const mapDispatchToProps = {
  refreshReportsArray,
  callForEdit,
  onReprompt: callForReprompt,
};

export const OfficeLoadedFile = connect(mapStateToProps,
  mapDispatchToProps)(withTranslation('common')(_OfficeLoadedFile));
