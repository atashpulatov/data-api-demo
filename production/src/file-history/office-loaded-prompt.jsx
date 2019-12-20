import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Radio, Button, Divider } from 'antd';

export default function OfficeLoadedPrompt({ answerHandler, closeHandler }) {
  const [answer, onAnswerChange] = useState(false);

  const wrapperStyle = {
    color: 'red',
    position: 'absolute',
    border: 'solid 1px black',
    top: '66px',
    left: '20px',
    right: '20px',
    background: 'white',
    zIndex: '2',
    display: 'flex',
    flexDirection: 'column'
  };
  const buttonWrapperStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  };
  const overlayStyle = {
    position:'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'rgba(255,255,255,0.5)',
    zIndex: '1'
  };

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
      <div style={overlayStyle}>
        <div style={wrapperStyle}>
          <h3>Select destination</h3>
          <Divider />
          <Radio.Group onChange={(e) => { onAnswerChange(e.target.value); }} value={answer} autofocus>
            {worksheetOptions.map((option) => <Radio style={{ display: 'block' }} value={option.value} key={option.label}>{option.label}</Radio>)}
          </Radio.Group>
          <Divider />
          <div style={buttonWrapperStyle}>
            <Button type="button" onClick={(e) => { e.preventDefault(); answerHandler(answer); }}>OK</Button>
            <Button type="button" onClick={(e) => { e.preventDefault(); closeHandler(); }}>Cancel</Button>
          </div>
        </div>
      </div>,
      document.getElementById('office-loaded-prompt-container')
    )
  );
}
