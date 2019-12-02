/* eslint-disable no-underscore-dangle */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import warningIcon from '../loading/assets/icon_conflict.svg';
import { officeApiHelper } from '../office/office-api-helper';
import { toggleSecuredFlag, toggleIsConfirmFlag, toggleIsClearingFlag } from '../office/office-actions';
import { errorService } from '../error/error-handler';
import { notificationService } from '../notification/notification-service';

export const _Confirmation = ({ reportArray, toggleSecuredFlag, toggleIsConfirmFlag, toggleIsClearingFlag, t }) => {
  useEffect(() => {
    const ua = window.navigator.userAgent;
    // this is fix IE11 - it didn't handle z-index properties correctly
    if (ua.indexOf('MSIE') > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./)) {
      const elm = document.querySelector('.confirm-container');
      elm.style.zIndex = -1;
      setTimeout(() => {
        elm.style.zIndex = 3000;
      }, 100);
    }
  });
  const secureData = async () => {
    let counter = 0;
    let reportName = '';
    const clearErrors = [];
    try {
      toggleIsClearingFlag(true);
      toggleIsConfirmFlag(); // Switch off isConfirm popup
      const excelContext = await officeApiHelper.getExcelContext();
      await officeApiHelper.checkIfAnySheetProtected(excelContext, reportArray);
      for (const report of reportArray) {
        if (await officeApiHelper.checkIfObjectExist(report, excelContext)) {
          try {
            reportName = report.name;
            if (report.isCrosstab) {
              const officeTable = await officeApiHelper.getTable(excelContext, report.bindId);
              officeApiHelper.clearEmptyCrosstabRow(officeTable); // Since showing Excel table header dont override the data but insert new row, we clear values from empty row in crosstab to prevent it
              officeTable.showHeaders = true;
              officeTable.showFilterButton = false;
              const headers = officeTable.getHeaderRowRange();
              headers.format.font.color = 'white';
              await excelContext.sync();
            }
            await officeApiHelper.deleteObjectTableBody(excelContext, report);
          } catch (error) {
            const officeError = errorService.handleError(error);
            clearErrors.push({ reportName, officeError });
          }
        } else {
          counter++;
        }
      }
      if (clearErrors.length > 0) {
        displayClearDataError(clearErrors);
      } else if (counter !== reportArray.length) toggleSecuredFlag(true);
    } catch (error) {
      errorService.handleError(error);
    } finally {
      toggleIsClearingFlag(false);
    }
  };

  function displayClearDataError(clearErrors) {
    const reportNames = clearErrors.map((report) => report.reportName).join(', ');
    const errorMessage = clearErrors.map((report) => report.errorMessage).join(', ');
    notificationService.displayTranslatedNotification('warning', t('{{reportNames}} could not be cleared.', { reportNames }), errorMessage);
  }

  return (
    <>
      <div className="block-ui" onClick={() => toggleIsConfirmFlag(false)} />
      <div className="confirm-container">
        <div className="confirm-header">
          <span className="confirm-header-icon"><img width="19px" height="18px" src={warningIcon} alt={t('Refresh failed icon')} /></span>
        </div>
        <div className="confirm-message">
          <div className="confirm-message-title">
            <div dangerouslySetInnerHTML={{ __html: t('Are you sure you want to <span>Clear Data</span>?') }} />
          </div>
          <div className="confirm-message-text">
            {t('This removes all MicroStrategy data from the workbook.')}
            <br />
            <div dangerouslySetInnerHTML={{ __html: t('In order to re-import the data, you will have to click the <span>View Data</span> button, which will appear in the add-in panel.') }} />
          </div>
        </div>
        <div className="confirm-buttons">
          <button className="ant-btn" id="confirm-btn" onClick={secureData}>{t('OK')}</button>
          <button className="ant-btn" id="cancel-btn" onClick={() => toggleIsConfirmFlag(false)}>{t('Cancel')}</button>
        </div>
      </div>
    </>
  );
};

_Confirmation.propTypes = {
  reportArray: PropTypes.arrayOf(PropTypes.shape({})),
  toggleSecuredFlag: PropTypes.func,
  toggleIsConfirmFlag: PropTypes.func,
  toggleIsClearingFlag: PropTypes.func,
  t: PropTypes.func
};

_Confirmation.defaultProps = { t: (text) => text, };

function mapStateToProps({ officeReducer }) {
  return { reportArray: officeReducer.reportArray };
}

const mapDispatchToProps = {
  toggleSecuredFlag,
  toggleIsConfirmFlag,
  toggleIsClearingFlag,
};

export const Confirmation = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_Confirmation));
