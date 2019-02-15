import React from 'react';
import {Button} from 'antd';
import './popup-buttons.css';

export const PopupButtons = ({handleOk, handleSecondary,
  handleCancel, loading}) => (
  <div className="popup-buttons popup-footer">
    <Button id="back" onClick={handleCancel}>
        Back
    </Button>
    <Button id="import" onClick={handleOk}>
        loading={loading}>
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
