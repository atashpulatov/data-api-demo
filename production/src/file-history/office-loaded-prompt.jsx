import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Radio, Button } from 'antd';
import './office-loaded-prompt.scss';

export default function OfficeLoadedPrompt({ answerHandler, closeHandler }) {
  const [answer, onAnswerChange] = useState(false);

  const worksheetOptions = [
    {
      value: false,
      label: 'Active Cell'
    },
    {
      value: true,
      label: 'New Sheet'
    },
  ];

  return (
    ReactDOM.createPortal(
      <div className="component-overlay">
        <div className="component-wrapper">
          <div className="title">Select destination</div>
          <div className="divider" />
          <Radio.Group onChange={(e) => { onAnswerChange(e.target.value); }} value={answer} autofocus>
            {worksheetOptions.map((option) => <Radio style={{ display: 'block' }} value={option.value} key={option.label}>{option.label}</Radio>)}
          </Radio.Group>
          <div className="divider" />
          <div className="buttons-row">
            <Button type="primary" onClick={(e) => { e.preventDefault(); answerHandler(answer); }}>OK</Button>
            <Button onClick={(e) => { e.preventDefault(); closeHandler(); }}>Cancel</Button>
          </div>
        </div>
      </div>,
      document.getElementById('office-loaded-prompt-container')
    )
  );
}
