import React from 'react';
import {Button} from 'antd';
import './popup-buttons.css';

export const PopupButtons = ({handleOk, handleSecondary,
  handleCancel, handleBack, loading}) => (
  <div className="popup-buttons popup-footer">
    {
      !handleBack &&
        <Button id="backCancel" onClick={handleCancel}>
          Back
        </Button>}
    {
      handleBack &&
        <Button id="back" onClick={handleBack}>
          Back
        </Button>}
    <Button id="import" onClick={handleOk} loading={loading}>
      Import
    </Button>
    {
      handleSecondary &&
        <Button id="prepare" type="primary"
          onClick={handleSecondary}
          loading={loading}>
          Prepare Data
        </Button>
    }
    <Button id="cancel" onClick={handleCancel}>
      Cancel
    </Button>
  </div>
);
