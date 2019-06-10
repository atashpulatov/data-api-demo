import {officeProperties} from './office-properties';

export function toggleStoreSecuredFlag(isSecured) {
  return (dispatch) => {
    dispatch({
      type: officeProperties.actions.toggleSecuredFlag,
      isSecured,
    });
  };
}

export const actions = {
  toggleStoreSecuredFlag,
};
