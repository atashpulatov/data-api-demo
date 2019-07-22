import React from 'react';
import {connect} from 'react-redux';
import warningIcon from '../loading/assets/icon_conflict.svg';
import {officeApiHelper} from '../office/office-api-helper';
import {toggleSecuredFlag, toggleIsSettingsFlag, toggleIsConfirmFlag} from '../office/office-actions';
import {withTranslation} from 'react-i18next';

const _Confirmation = ({reportArray, toggleSecuredFlag, toggleIsConfirmFlag, toggleIsSettingsFlag}) => {
  const secureData = async () => {
    console.log('report array', reportArray);
    const excelContext = await officeApiHelper.getExcelContext();
    for (const report of reportArray) {
      await officeApiHelper.deleteObjectTableBody(excelContext, report);
    };
    toggleIsConfirmFlag(false);
    toggleIsSettingsFlag(false);
    toggleSecuredFlag(true);
  };

  return (
    <React.Fragment>
      <div className='block-ui' onClick={() => toggleIsConfirmFlag(false)}>
      </div>
      <div className='confirm-container'>
        <div className='confirm-header'>
          <span className="confirm-header-icon"><img width='19px' height='18px' src={warningIcon} alt='Refresh failed icon' /></span>
        </div>
        <div className='confirm-message'>
          <div className='confirm-message-title'>
            Are you sure you want to <span className=''>Clear Data</span>?
          </div>
          <div className='confirm-message-text'>
            This removes all MicroStrategy data from the workbook.
            <br></br>
            In order to re-import the data, you will have to click the <span>View Data</span> button, which will appear in the add-in panel.
          </div>
        </div>
        <div className='confirm-buttons'>
          <button className='ant-btn' onClick={secureData}>OK</button>
          <button className='ant-btn' onClick={() => toggleIsConfirmFlag(false)}>Cancel</button>
        </div>
      </div>
    </React.Fragment>
  );
};

_Confirmation.defaultProps = {
  t: (text) => text,
}; ;

function mapStateToProps({officeReducer}) {
  const {reportArray} = officeReducer;
  return {reportArray};
};

const mapDispatchToProps = {
  toggleSecuredFlag,
  toggleIsSettingsFlag,
  toggleIsConfirmFlag,
};

export const Confirmation = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_Confirmation));
