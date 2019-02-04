import React from 'react';
import {Button} from 'antd';
import './popup-buttons.css';

export const PopupButtons = ({handleOk, handleCancel}) => (
  <div className="popup-buttons">
    <Button key="cancel" onClick={handleCancel}>
      Cancel
    </Button>
    <Button key="import" onClick={handleCancel}>
      Import
    </Button>
    <Button key="submit" type="primary" onClick={handleCancel}>
      Prepare Data
    </Button>
  </div>
);
