import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import warningIcon from '../loading/assets/icon_conflict.svg';
import {officeApiHelper} from '../office/office-api-helper';
import {toggleSecuredFlag, toggleIsConfirmFlag, toggleIsClearingFlag} from '../office/office-actions';
import {withTranslation} from 'react-i18next';
import {errorService} from '../error/error-handler';
import {notificationService} from '../notification/notification-service';

export const _Confirmation = ({reportArray, toggleSecuredFlag, toggleIsConfirmFlag, toggleIsClearingFlag, t}) => {
  useEffect(() => {
    const ua = window.navigator.userAgent;
    // this is fix IE11 - it didn't handle z-index properties correctly
    if (ua.indexOf('MSIE') > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      const elm = document.querySelector('.confirm-container');
      elm.style.zIndex = -1;
      setTimeout(() => {
        elm.style.zIndex = 3000;
      }, 100);
    }
  });
  const secureData = async () => {
    let reportName = '';
    const clearErrors = [];
    try {
      toggleIsClearingFlag(true);
      toggleIsConfirmFlag(false);
      const excelContext = await officeApiHelper.getExcelContext();
      for (const report of reportArray) {
        try {
          reportName = report.name;
          if (!!report.isCrosstab) {
            const officeTable = await officeApiHelper.getTable(excelContext, report.bindId);
            officeTable.showHeaders = true;
            officeTable.showFilterButton = false;
            const headers = officeTable.getHeaderRowRange();
            headers.format.font.color = 'white';
            await excelContext.sync();
          }
          await officeApiHelper.deleteObjectTableBody(excelContext, report);
        } catch (error) {
          const officeError = errorService.errorOfficeFactory(error);
          const errorMessage = errorService.getErrorMessage(officeError);
          clearErrors.push({reportName, errorMessage});
        }
      };
      toggleIsClearingFlag(false);
      if (clearErrors.length > 0) {
        displayClearDataError(clearErrors);
      } else {
        toggleSecuredFlag(true);
      }
    } catch (error) {
      errorService.handleOfficeError(error);
    }
  };

  function displayClearDataError(clearErrors) {
    const reportNames = clearErrors.map((report) => report.reportName).join(', ');
    const errorMessage = clearErrors.map((report) => report.errorMessage).join(', ');
    notificationService.displayTranslatedNotification('warning', t('{{reportNames}} could not be cleared.', {reportNames}), errorMessage);
  }

  return (
    <React.Fragment>
      <div className='block-ui' onClick={() => toggleIsConfirmFlag(false)} />
      <div className='confirm-container'>
        <div className='confirm-header'>
          <span className="confirm-header-icon"><img width='19px' height='18px' src={warningIcon} alt={t('Refresh failed icon')} /></span>
        </div>
        <div className='confirm-message'>
          <div className='confirm-message-title'>
            <div dangerouslySetInnerHTML={{__html: t('Are you sure you want to <span>Clear Data</span>?')}}></div>
          </div>
          <div className='confirm-message-text'>
            {t('This removes all MicroStrategy data from the workbook.')}
            <br />
            <div dangerouslySetInnerHTML={{__html: t('In order to re-import the data, you will have to click the <span>View Data</span> button, which will appear in the add-in panel.')}}></div>
          </div>
        </div>
        <div className='confirm-buttons'>
          <button className='ant-btn' id='confirm-btn' onClick={secureData}>{t('OK')}</button>
          <button className='ant-btn' id='cancel-btn' onClick={() => toggleIsConfirmFlag(false)}>{t('Cancel')}</button>
        </div>
      </div>
    </React.Fragment>
  );
};

_Confirmation.defaultProps = {
  t: (text) => text,
};

function mapStateToProps({officeReducer}) {
  return {reportArray: officeReducer.reportArray};
};

const mapDispatchToProps = {
  toggleSecuredFlag,
  toggleIsConfirmFlag,
  toggleIsClearingFlag,
};

export const Confirmation = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_Confirmation));
