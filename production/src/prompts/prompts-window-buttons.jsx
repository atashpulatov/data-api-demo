import React from 'react';
import {Button} from 'antd';
import '../popup/popup-buttons.css';

export const PromptWindowButtons = ({handleRun, handleCancel}) => {
  return (
    <div className="popup-buttons popup-footer">      
      <Button id="run" onclick={handleRun}>
        Run
      </Button>
      <Button id="cancel" onClick={handleCancel}>
        Cancel
      </Button>
    </div >
  );
};
