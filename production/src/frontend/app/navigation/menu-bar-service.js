import { reduxStore } from '../store';
import { historyProperties } from '../history/history-properties';
import { sessionProperties } from '../storage/session-properties';

class MenuBarService {
    goUp() {
        reduxStore.dispatch({
            type: historyProperties.actions.goUp,
        });
    };

    goProjects() {
        reduxStore.dispatch({
            type: historyProperties.actions.goToProjects,
        });
    };

    logOut() {
        reduxStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
    };
};

export const menuBarService = new MenuBarService();
