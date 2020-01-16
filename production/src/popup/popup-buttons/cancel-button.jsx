import React from 'react';
import { Button } from 'antd';

export const CancelButton = ({ handleCancel, t }) => (
  <Button id="cancel" onClick={handleCancel}>
    {t('Cancel')}
  </Button>
);
