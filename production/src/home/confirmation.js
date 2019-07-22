import React from 'react';
import {connect} from 'react-redux';
import warningIcon from '../loading/assets/icon_conflict.svg';
import {officeApiHelper} from '../office/office-api-helper';
import {toggleSecuredFlag, toggleIsConfirmFlag} from '../office/office-actions';
import {withTranslation} from 'react-i18next';

const _Confirmation = ({reportArray, toggleSecuredFlag, toggleIsConfirmFlag}) => {
  const secureData = async () => {
    console.log('report array', reportArray);
    const excelContext = await officeApiHelper.getExcelContext();
    for (const report of reportArray) {
      await officeApiHelper.deleteObjectTableBody(excelContext, report);
    };
    toggleIsConfirmFlag(false);
    toggleSecuredFlag(true);
  };

  return (
    <React.Fragment>
      <div className='no-trigger-close block-ui' onClick={() => toggleIsConfirmFlag(false)}>
      </div>
      <div className='no-trigger-close confirm-container'>
        <div className='no-trigger-close confirm-header'>
          <span className="no-trigger-close confirm-header-icon"><img className='no-trigger-close' width='19px' height='18px' src={warningIcon} alt='Refresh failed icon' /></span>
        </div>
        <div className='no-trigger-close confirm-message'>
          <div className='confirm-message-title no-trigger-close'>
            Are you sure you want to <span className='no-trigger-close'>Clear Data</span>?
          </div>
          <div className='confirm-message-text no-trigger-close'>
            This removes all MicroStrategy data from the workbook.
            <br></br>
            In order to re-import the data, you will have to click the <span>View Data</span> button, which will appear in the add-in panel.
          </div>
        </div>
        <div className='confirm-buttons no-trigger-close'>
          <button className='ant-btn' onClick={secureData}>OK</button>
          <button className='ant-btn no-trigger-close' onClick={() => toggleIsConfirmFlag(false)}>Cancel</button>
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
  toggleIsConfirmFlag,
};

export const Confirmation = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_Confirmation));
