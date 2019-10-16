import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { MSTRIcon } from '@mstr/mstr-react-library';
import { withTranslation } from 'react-i18next';
import { OfficeLoadedFile } from './office-loaded-file';
import { officeApiHelper } from '../office/office-api-helper';
import { officeDisplayService } from '../office/office-display-service';
import loadingSpinner from './assets/report_loading_spinner.gif';
import { refreshReportsArray } from '../popup/popup-actions';
import { fileHistoryContainerHOC } from './file-history-container-HOC';
import { officeStoreService } from '../office/store/office-store-service';
import { toggleSecuredFlag } from '../office/office-actions';
import { errorService } from '../error/error-handler';
import { authenticationHelper } from '../authentication/authentication-helper';
import restrictedArt from './assets/art_restricted_access_blue.svg';
import { notificationService } from '../notification/notification-service';
import './file-history.css';
import { ButtonPopover } from './button-popover';
import { startLoading, stopLoading } from '../navigation/navigation-tree-actions';

export class _FileHistoryContainer extends React.Component {
  constructor(props) {
    super(props);
    if (officeStoreService.isFileSecured()) {
      props.toggleSecuredFlag(true);
    }
    this.state = { allowRefreshAllClick: true, };
  }

  componentDidMount() {
    this._ismounted = true;
    this.addRemoveReportListener();
  }

  componentWillUnmount() {
    this._ismounted = false;
    this.deleteRemoveReportListener();
  }

  addRemoveReportListener = async () => {
    try {
      const excelContext = await officeApiHelper.getExcelContext();
      if (window.Office.context.requirements.isSetSupported('ExcelApi', 1.92)) {
        this.eventRemove = excelContext.workbook.tables.onDeleted.add(async (e) => {
          const { reportArray, t } = this.props;
          try {
            await Promise.all([
              officeApiHelper.getExcelSessionStatus(),
              authenticationHelper.validateAuthToken(),
            ]);
            const { name } = reportArray.find((report) => report.bindId === e.tableName);
            officeDisplayService.removeReportFromStore(e.tableName);
            const message = t('{{name}} has been removed from the workbook.', { name });
            notificationService.displayTranslatedNotification({ type: 'success', content: message });
          } catch (error) {
            errorService.handleError(error);
          }
        });
      } else if (window.Office.context.requirements.isSetSupported('ExcelApi', 1.7)) {
        this.eventRemove = excelContext.workbook.worksheets.onDeleted.add(async () => {
          try {
            await Promise.all([
              officeApiHelper.getExcelSessionStatus(),
              authenticationHelper.validateAuthToken(),
            ]);
            excelContext.workbook.tables.load('items');
            await excelContext.sync()
            const reportsOfSheets = excelContext.workbook.tables.items
            const { reportArray, t } = this.props;
            const reportsToBeDeleted = reportArray.filter((report) => !reportsOfSheets.find((table) => table.name === report.bindId));
            for (const report of reportsToBeDeleted) {
              const { name } = report;
              officeDisplayService.removeReportFromStore(report.bindId);
              const message = t('{{name}} has been removed from the workbook.', { name });
              notificationService.displayTranslatedNotification({ type: 'success', content: message });
            }
          } catch (error) {
            errorService.handleError(error);
          }
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
        if (this._ismounted) this.setState({ allowRefreshAllClick: true });
      });
    }
  };

  showData = async () => {
    try {
      await Promise.all([
        officeApiHelper.getExcelSessionStatus(),
        authenticationHelper.validateAuthToken(),
      ]);
      const {
        reportArray,
        refreshReportsArray,
        toggleSecuredFlag,
      } = this.props;
      this.refreshAllAction(reportArray, refreshReportsArray);
      toggleSecuredFlag(false);
    } catch (error) {
      return errorService.handleError(error);
    }
  };

  render() {
    const {
      reportArray = [],
      loading,
      refreshingAll,
      refreshReportsArray,
      isSecured,
      addDataAction,
      t,
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
        <Button
          id="add-data-btn-container"
          className="add-data-btn floating-button"
          onClick={() => addDataAction()}
          disabled={loading}
        >
          {t('Add Data')}
        </Button>
        <span className="refresh-button-container">
          <ButtonPopover
            placement="bottom"
            content={t('Refresh All Data')}
            mouseEnterDelay={1}
          >
            <Button
              id="refresh-all-btn"
              className="refresh-all-btn"
              style={{ float: 'right' }}
              onClick={() => this.refreshAllAction(reportArray, refreshReportsArray)}
              disabled={loading}
            >
              {!refreshingAll ? (
                <MSTRIcon type="refresh" />
              ) : (
                <img width="12px" height="12px" src={loadingSpinner} alt={t('Report loading icon')} />
                )}
            </Button>
          </ButtonPopover>
        </span>
        <div role="list" className="tables-container">
          {reportArray.map((report) => (
            <OfficeLoadedFile
              isPrompted={report.isPrompted}
              key={report.bindId}
              fileName={report.name}
              bindingId={report.bindId}
              onClick={officeApiHelper.onBindingObjectClick}
              onDelete={officeDisplayService.removeReportFromExcel}
              isLoading={report.isLoading}
              isCrosstab={report.isCrosstab}
              crosstabHeaderDimensions={report.crosstabHeaderDimensions}
              objectType={report.objectType}
              refreshDate={report.refreshDate}
              visualizationInfo={report.visualizationInfo}
            />
          ))}
        </div>
      </>
    );
  }
}

_FileHistoryContainer.defaultProps = { t: (text) => text, };

function mapStateToProps({ officeReducer, historyReducer }) {
  return {
    reportArray: officeReducer.reportArray,
    project: historyReducer.project,
    refreshingAll: officeReducer.isRefreshAll,
    isSecured: officeReducer.isSecured,
  };
}

const mapDispatchToProps = {
  refreshReportsArray,
  toggleSecuredFlag,
  startLoading,
  stopLoading,
};

const WrappedFileHistoryContainer = fileHistoryContainerHOC(_FileHistoryContainer);

export const FileHistoryContainer = connect(mapStateToProps,
  mapDispatchToProps)(withTranslation('common')(WrappedFileHistoryContainer));
