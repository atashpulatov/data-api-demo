import { reduxStore } from '../store';
import { sessionProperties } from './session-properties';

class SessionHelper {
    enableLoading() {
        reduxStore.dispatch({
            type: sessionProperties.actions.setLoading,
            loading: true,
        });
    }
    disableLoading() {
        reduxStore.dispatch({
            type: sessionProperties.actions.setLoading,
            loading: false,
        });
    }
}

export const sessionHelper = new SessionHelper();
