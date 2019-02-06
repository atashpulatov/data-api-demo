import React from 'react';
import {Button} from 'antd';
import './popup-buttons.css';

export const PopupButtons = ({handleOk, handleCancel}) => (
  <div className="popup-buttons popup-footer">
    <Button key="back" onClick={handleCancel}>
      Back
    </Button>
    <Button key="import" onClick={handleOk}>
      Import
    </Button>
    <Button key="prepare" type="primary" onClick={handleOk}>
      Prepare Data
    </Button>
    <Button key="cancel" onClick={handleCancel}>
      Cancel
    </Button>
  </div>
);
