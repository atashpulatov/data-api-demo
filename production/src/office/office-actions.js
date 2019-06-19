import {officeProperties} from './office-properties';
import {officeStoreService} from './store/office-store-service';

export function toggleSecuredFlag(isSecured) {
  officeStoreService.toggleFileSecuredFlag(isSecured);
  return (dispatch) => {
    dispatch({
      type: officeProperties.actions.toggleSecuredFlag,
      isSecured,
    });
  };
}

export const actions = {
  toggleSecuredFlag,
};
