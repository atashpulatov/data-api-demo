import React from 'react';
import {Button} from 'antd';
import './popup-buttons.css';

export const PopupButtons = ({handleOk, handleCancel}) => (
  <div className="popup-buttons popup-footer">
    <Button key="cancel" onClick={handleCancel}>
      Back
    </Button>
    <Button key="import" onClick={handleCancel}>
      Import
    </Button>
    <Button key="submit" type="primary" onClick={handleCancel}>
      Prepare Data
    </Button>
    <Button key="submit" onClick={handleCancel}>
      Cancel
    </Button>
  </div>
);
