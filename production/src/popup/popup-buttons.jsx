import React from 'react';
import {Button} from 'antd';
import './popup-buttons.css';
import {connect} from 'react-redux';

export const _PopupButtons = ({handleOk, handleSecondary,
  handleCancel, handleBack, loading, disableActiveActions, onPreviewClick, isPrompted}) => {
  return (
    <div className="popup-buttons popup-footer">
      {!handleSecondary && <Button id="data-preview" onClick={onPreviewClick} disabled={disableActiveActions}>
        Data Preview
      </Button>}
      {
        handleBack &&
        <Button id="back" onClick={handleBack}>
          Back
        </Button>
      }
      <Button id="import" type={!handleSecondary ? 'primary' : ''} onClick={handleOk} loading={loading} disabled={disableActiveActions}>
        Import
      </Button>
      {
        handleSecondary &&
        <Button id="prepare" type="primary"
          disabled={disableActiveActions || loading || isPrompted}
          onClick={handleSecondary}>
          Prepare Data
        </Button>
      }
      <Button id="cancel" onClick={handleCancel}>
        Cancel
      </Button>
    </div >
  );
};

function mapStateToProps({navigationTree}) {
  return {isPrompted: navigationTree.isPrompted};
}


export const PopupButtons = connect(mapStateToProps)(_PopupButtons);
