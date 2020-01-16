import React from 'react';
import { Button } from 'antd';

export const BackButton = ({ handleBack, t }) => (<Button id="back" onClick={handleBack}>{t('Back')}</Button>);
