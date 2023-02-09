import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import * as React from 'react';

export interface FormType {
  validateFields: (callback: Function) => void;
  getFieldDecorator: <T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions) =>
    (node: React.ReactNode) => React.ReactNode;
}

export interface AuthenticateNotConnectedProps{
  form: FormType;
  session: {
    username: string;
    password: string;
    envUrl: string;
    loginMode: string;
    isRememberMeOn: boolean
  };
  resetState: () => void;
  t: (text: string) => string;
}
