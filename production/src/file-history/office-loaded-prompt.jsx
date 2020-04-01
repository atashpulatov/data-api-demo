import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Radio, Button } from 'antd';
import './office-loaded-prompt.scss';

export default function OfficeLoadedPrompt({ answerHandler, closeHandler, t }) {
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
    <div className="component-overlay">
      <div className="component-wrapper">
        <div className="title">{t('Select destination')}</div>
        <div className="divider" />
        <Radio.Group onChange={(e) => { onAnswerChange(e.target.value); }} value={answer} autofocus>
          {worksheetOptions.map((option) => <Radio value={option.value} key={option.label}>{t(`${option.label}`)}</Radio>)}
        </Radio.Group>
        <div className="divider" />
        <div className="buttons-row">
          <Button type="primary" onClick={(e) => { e.preventDefault(); answerHandler(answer); }}>{t('OK')}</Button>
          <Button onClick={(e) => { e.preventDefault(); closeHandler(); }}>{t('Cancel')}</Button>
        </div>
      </div>
    </div>
  );
}

OfficeLoadedPrompt.propTypes = {
  t: PropTypes.func,
  answerHandler: PropTypes.func,
  closeHandler: PropTypes.func,
};
