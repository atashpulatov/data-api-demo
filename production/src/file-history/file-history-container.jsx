import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { MSTRIcon } from '@mstr/mstr-react-library';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { OfficeLoadedFile } from './office-loaded-file';
import { officeApiHelper } from '../office/api/office-api-helper';
import loadingSpinner from './assets/report_loading_spinner.gif';
import { popupActions } from '../popup/popup-actions';
import { fileHistoryContainerHOC } from './file-history-container-HOC';
import officeStoreHelper from '../office/store/office-store-helper';
import { toggleSecuredFlag as toggleSecuredFlagImported } from '../redux-reducer/office-reducer/office-actions';
import { errorService } from '../error/error-handler';
import restrictedArt from './assets/art_restricted_access_blue.svg';
import './file-history.scss';
import './settings-list.scss';
import { ButtonPopover } from './button-popover';
import {
  startLoading as startLoadingImported,
  stopLoading as stopLoadingImported
} from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { officeRemoveHelper } from '../office/remove/office-remove-helper';
import { sessionHelper } from '../storage/session-helper';
import { DevelopmentImportList } from '../development-import-list';

export class FileHistoryContainerNotConnected extends React.Component {
  constructor(props) {
    super(props);
    if (officeStoreHelper.isFileSecured()) {
      props.toggleSecuredFlag(true);
    }
    this.state = { allowRefreshAllClick: true, };
  }

  componentDidMount() {
    this.ismounted = true;
    this.addRemoveReportListener();
  }

  componentWillUnmount() {
    this.ismounted = false;
    this.deleteRemoveReportListener();
  }


  addRemoveReportListener = async () => {
    try {
      const { startLoading, stopLoading } = this.props;
      const excelContext = await officeApiHelper.getExcelContext();
      const officeContext = await officeApiHelper.getOfficeContext();
      if (officeContext.requirements.isSetSupported('ExcelApi', 1.9)) {
        this.eventRemove = excelContext.workbook.tables.onDeleted.add(async (e) => {
          startLoading();
          await officeApiHelper.checkStatusOfSessions();
          const { reportArray, t } = this.props;
          const reportToDelete = reportArray.find((report) => report.bindId === e.tableId);
          officeRemoveHelper.removeObjectAndDisplaytNotification(reportToDelete, officeContext, t);
          stopLoading();
        });
      } else if (officeContext.requirements.isSetSupported('ExcelApi', 1.7)) {
        this.eventRemove = excelContext.workbook.worksheets.onDeleted.add(async () => {
          startLoading();
          await officeApiHelper.checkStatusOfSessions();
          excelContext.workbook.tables.load('items');
          await excelContext.sync();
          const reportsOfSheets = excelContext.workbook.tables.items;
          const { reportArray, t } = this.props;

          const reportsToBeDeleted = reportArray.filter(
            (report) => !reportsOfSheets.find((officeTable) => officeTable.name === report.bindId)
          );

          for (const report of reportsToBeDeleted) {
            officeRemoveHelper.removeObjectAndDisplaytNotification(report, officeContext, t);
          }
          stopLoading();
        });
      }
      excelContext.sync();
    } catch (error) {
      console.log('Cannot add onDeleted event listener');
    }
  };

  deleteRemoveReportListener = () => {
    try {
      const eventRemoveContext = this.eventRemove.context;
      this.eventRemove.remove();
      eventRemoveContext.sync();
    } catch (error) {
      console.log('Cannot remove onDeleted event listener');
    }
  };

  refreshAllAction = (reportArray, refreshAll) => {
    const { startLoading } = this.props;
    startLoading();
    const { allowRefreshAllClick } = this.state;
    if (allowRefreshAllClick) {
      this.setState({ allowRefreshAllClick: false }, async () => {
        await refreshAll(reportArray, true);
        if (this.ismounted) { this.setState({ allowRefreshAllClick: true }); }
      });
    }
  };

  removeAllAction = (reportArray) => {
    const { startLoading, stopLoading } = this.props;
    startLoading();
    const { allowRefreshAllClick } = this.state;
    if (allowRefreshAllClick) {
      for (let index = 0; index < reportArray.length; index++) {
        const object = reportArray[index];
        this.setState({ allowRefreshAllClick: false }, async () => {
          await officeRemoveHelper.removeReportFromExcel(
            object.bindId,
            object.isCrosstab,
            object.crosstabHeaderDimensions,
            object.objectWorkingId
          );
        });
      }
    }
    stopLoading();
  };

  showData = async () => {
    try {
      await officeApiHelper.checkStatusOfSessions();
      const { reportArray, refreshReportsArray, toggleSecuredFlag, } = this.props;
      this.refreshAllAction(reportArray, refreshReportsArray);
      toggleSecuredFlag(false);
    } catch (error) {
      return errorService.handleError(error);
    }
  };

  render() {
    const {
      reportArray = [], loading, refreshingAll, refreshReportsArray, isSecured, addDataAction, t,
    } = this.props;
    return (
      <>
        {
          isSecured
          && (
            <div className="secured-screen-container">
              <img src={restrictedArt} alt={t('Refresh')} />
              <div className="secured-header">{t('Data Cleared!')}</div>
              <p className="secured-info">{t('MicroStrategy data has been removed from the workbook. Click \'View Data\' to import it again.')}</p>
              <Button type="primary" className="show-data-btn" onClick={this.showData}>{t('View Data')}</Button>
            </div>
          )
        }
        {(sessionHelper.isDevelopment()) && (
          <DevelopmentImportList
            reportArray={reportArray}
            removeAllAction={this.removeAllAction} />
        )}
        <div className="refresh-button-container">
          <Button
            id="add-data-btn-container"
            className="add-data-btn floating-button"
            onClick={() => addDataAction()}
            disabled={loading}
          >
            {t('Add Data')}
          </Button>

          <ButtonPopover
            placement="bottom"
            content={t('Refresh All Data')}
            mouseEnterDelay={1}
          >
            { !refreshingAll ? (
              <div
                aria-label={t('Refresh All button')}
                role="button"
                tabIndex={0}
                id="refresh-all-btn"
                className="refresh-all-btn"
                onClick={() => this.refreshAllAction(reportArray, refreshReportsArray)}
                onKeyPress={() => this.refreshAllAction(reportArray, refreshReportsArray)}
                disabled={loading}
              >
                <div className="mstr-icon-refresh-all icon-align">
                  <MSTRIcon type="refresh" />
                </div>
              </div>
            ) : (
              <div className="spinner-all-icon">
                <img
                  width="12px"
                  height="12px"
                  src={loadingSpinner}
                  alt={t('Report loading icon')}
                />
              </div>
            )}
          </ButtonPopover>
        </div>
        <div role="list" className="tables-container">
          {reportArray.map((report) => (
            <OfficeLoadedFile
              isPrompted={report.isPrompted}
              key={report.bindId}
              fileName={report.name}
              bindId={report.bindId}
              onClick={officeApiHelper.onBindingObjectClick}
              onDelete={officeRemoveHelper.removeReportFromExcel}
              isLoading={report.isLoading}
              isCrosstab={report.isCrosstab}
              crosstabHeaderDimensions={report.crosstabHeaderDimensions}
              objectType={report.objectType}
              refreshDate={report.refreshDate}
              visualizationInfo={report.visualizationInfo}
              objectWorkingId={report.objectWorkingId}
            />
          ))}
        </div>
      </>
    );
  }
}

FileHistoryContainerNotConnected.propTypes = {
  loading: PropTypes.bool,
  refreshingAll: PropTypes.bool,
  isSecured: PropTypes.bool,
  reportArray: PropTypes.arrayOf(PropTypes.shape({})),
  toggleSecuredFlag: PropTypes.func,
  startLoading: PropTypes.func,
  stopLoading: PropTypes.func,
  refreshReportsArray: PropTypes.func,
  addDataAction: PropTypes.func,
  t: PropTypes.func
};

FileHistoryContainerNotConnected.defaultProps = { t: (text) => text, };

function mapStateToProps({ officeReducer }) {
  return {
    reportArray: officeReducer.reportArray,
    refreshingAll: officeReducer.isRefreshAll,
    isSecured: officeReducer.isSecured,
  };
}

const mapDispatchToProps = {
  refreshReportsArray: popupActions.refreshReportsArray,
  toggleSecuredFlag: toggleSecuredFlagImported,
  startLoading: startLoadingImported,
  stopLoading: stopLoadingImported,
};

const WrappedFileHistoryContainer = fileHistoryContainerHOC(FileHistoryContainerNotConnected);

export const FileHistoryContainer = connect(mapStateToProps,
  mapDispatchToProps)(withTranslation('common')(WrappedFileHistoryContainer));
