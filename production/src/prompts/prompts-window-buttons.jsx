import React from 'react';
import {Button} from 'antd';
import {connect} from 'react-redux';
import '../popup/popup-buttons.css';
import {cancelImportRequest} from '../navigation/navigation-tree-actions';

export const _PromptWindowButtons = ({handleRun, cancelImportRequest}) => {
  return (
    <div className="popup-buttons popup-footer">
      <Button id="run" onClick={handleRun}>
        Run
      </Button>
      <Button id="cancel" onClick={cancelImportRequest}>
        Cancel
      </Button>
    </div >
  );
};

export const PromptWindowButtons = connect(() => ({}), {cancelImportRequest})(_PromptWindowButtons);
