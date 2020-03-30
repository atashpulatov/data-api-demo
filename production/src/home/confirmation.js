/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import warningIcon from '../loading/assets/icon_conflict.svg';
import { officeApiHelper } from '../office/api/office-api-helper';
import {
  toggleSecuredFlag as toggleSecuredFlagImported,
  toggleIsConfirmFlag as toggleIsConfirmFlagImported,
  toggleIsClearingFlag as toggleIsClearingFlagImported
} from '../office/store/office-actions';
import { errorService } from '../error/error-handler';
import { notificationService } from '../notification/notification-service';
import { officeApiCrosstabHelper } from '../office/api/office-api-crosstab-helper';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';
import { officeRemoveHelper } from '../office/remove/office-remove-helper';

export const ConfirmationNotConnected = ({
  objects,
  isConfirm,
  toggleSecuredFlag,
  toggleIsConfirmFlag,
  toggleIsClearingFlag,
  t
}) => {
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
      await officeApiWorksheetHelper.checkIfAnySheetProtected(excelContext, objects);
      for (const report of objects) {
        if (await officeRemoveHelper.checkIfObjectExist(report, excelContext)) {
          try {
            reportName = report.name;
            if (report.isCrosstab) {
              const officeTable = await officeApiHelper.getTable(excelContext, report.bindId);
              officeApiCrosstabHelper.clearEmptyCrosstabRow(officeTable);
              officeTable.showHeaders = true;
              officeTable.showFilterButton = false;

              const headers = officeTable.getHeaderRowRange();
              headers.format.font.color = 'white';
              await excelContext.sync();
            }
            await officeRemoveHelper.removeOfficeTableBody(excelContext, report, true);
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
      } else if (counter !== objects.length) { toggleSecuredFlag(true); }
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

  const confirmationRef = React.useRef(null);

  React.useEffect(() => {
    const closeSettingsOnEsc = ({ keyCode }) => {
      keyCode === 27 && toggleIsConfirmFlag();
    };
    const closeSettingsOnClick = ({ target }) => {
      confirmationRef.current
          && !confirmationRef.current.contains(target)
          && toggleIsConfirmFlag();
    };
    if (isConfirm) {
      document.addEventListener('keyup', closeSettingsOnEsc);
      document.addEventListener('click', closeSettingsOnClick);
    }
    return () => {
      document.removeEventListener('keyup', closeSettingsOnEsc);
      document.removeEventListener('click', closeSettingsOnClick);
    };
  }, [isConfirm, toggleIsConfirmFlag]);

  return (
    <>
      <div
        className="block-ui" />
      <div className="confirm-container" ref={confirmationRef}>
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
          <button className="ant-btn" id="confirm-btn" type="button" onClick={secureData}>{t('OK')}</button>
          <button className="ant-btn" id="cancel-btn" type="button" onClick={() => toggleIsConfirmFlag(false)}>{t('Cancel')}</button>
        </div>
      </div>
    </>
  );
};

ConfirmationNotConnected.propTypes = {
  objects: PropTypes.arrayOf(PropTypes.shape({})),
  isConfirm: PropTypes.bool,
  toggleSecuredFlag: PropTypes.func,
  toggleIsConfirmFlag: PropTypes.func,
  toggleIsClearingFlag: PropTypes.func,
  t: PropTypes.func
};

ConfirmationNotConnected.defaultProps = { t: (text) => text, };

function mapStateToProps({ officeReducer, objectReducer }) {
  const { objects } = objectReducer;
  const { isConfirm } = officeReducer;
  return { objects, isConfirm };
}

const mapDispatchToProps = {
  toggleSecuredFlag: toggleSecuredFlagImported,
  toggleIsConfirmFlag: toggleIsConfirmFlagImported,
  toggleIsClearingFlag: toggleIsClearingFlagImported,
};

export const Confirmation = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(ConfirmationNotConnected));
