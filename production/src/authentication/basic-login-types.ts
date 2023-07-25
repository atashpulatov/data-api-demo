import React, { ReactChild } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  children: ReactChild | ReactChild[];
}

export interface LoginProps {
  username: string;
  password?: string;
  envUrl: string;
  rememberMe?: boolean;
  loginMode?: number;
}

export interface BasicLoginProps {
  restoreLoginProps: LoginProps;
  onSubmit: (props: LoginProps) => void;
}
