import { ConfigActionTypes, SetShowHiddenAction } from './config-reducer-types';

const setShowHidden = (showHidden: boolean): SetShowHiddenAction => ({
  type: ConfigActionTypes.SET_SHOW_HIDDEN,
  showHidden,
});

export const configActions = { setShowHidden };
