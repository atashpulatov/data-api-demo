import { configProperties } from './config-properties';

const setShowHidden = (showHidden) => ({ type: configProperties.actions.setShowHidden, showHidden });

export const configActions = { setShowHidden };
