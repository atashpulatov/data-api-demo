import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { MSTRIcon } from '@mstr/mstr-react-library';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { OfficeLoadedFile } from './office-loaded-file';
import { officeApiHelper } from '../office/office-api-helper';
import loadingSpinner from './assets/report_loading_spinner.gif';
import { popupActions } from '../popup/popup-actions';
import { fileHistoryContainerHOC } from './file-history-container-HOC';
import { officeStoreService } from '../office/store/office-store-service';
import { toggleSecuredFlag } from '../office/office-actions';
import { errorService } from '../error/error-handler';
import restrictedArt from './assets/art_restricted_access_blue.svg';
import './file-history.css';
import './settings-list.scss';
import { ButtonPopover } from './button-popover';
import { startLoading, stopLoading } from '../navigation/navigation-tree-actions';

export class FileHistoryContainerHOC extends React.Component {
  constructor(props) {
    super(props);
    if (officeStoreService.isFileSecured()) {
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
          const reportToDelete = reportArray.find((report) => report.bindId === e.tableName);
          officeApiHelper.removeObjectAndDisplaytNotification(reportToDelete, officeContext, t);
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
          const reportsToBeDeleted = reportArray.filter((report) => !reportsOfSheets.find((table) => table.name === report.bindId));
          for (const report of reportsToBeDeleted) {
            officeApiHelper.removeObjectAndDisplaytNotification(report, officeContext, t);
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
        if (this.ismounted) this.setState({ allowRefreshAllClick: true });
      });
    }
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
    const { reportArray = [], loading, refreshingAll, refreshReportsArray, isSecured, addDataAction, t, } = this.props;
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
              onDelete={officeApiHelper.removeReportFromExcel}
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

FileHistoryContainerHOC.propTypes = {
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

FileHistoryContainerHOC.defaultProps = { t: (text) => text, };

function mapStateToProps({ officeReducer, historyReducer }) {
  return {
    reportArray: officeReducer.reportArray,
    project: historyReducer.project,
    refreshingAll: officeReducer.isRefreshAll,
    isSecured: officeReducer.isSecured,
  };
}

const mapDispatchToProps = {
  refreshReportsArray: popupActions.refreshReportsArray,
  toggleSecuredFlag,
  startLoading,
  stopLoading,
};

const WrappedFileHistoryContainer = fileHistoryContainerHOC(FileHistoryContainerHOC);

export const FileHistoryContainer = connect(mapStateToProps,
  mapDispatchToProps)(withTranslation('common')(WrappedFileHistoryContainer));
