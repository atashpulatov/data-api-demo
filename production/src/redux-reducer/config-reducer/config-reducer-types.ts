import { Action } from 'redux';

export interface ConfigState {
  showHidden: boolean;
}

export enum ConfigActionTypes {
  SET_SHOW_HIDDEN = 'SET_SHOW_HIDDEN',
}

export interface SetShowHiddenAction extends Action {
  type: ConfigActionTypes.SET_SHOW_HIDDEN;
  showHidden: boolean;
}

export type ConfigActions = SetShowHiddenAction;
