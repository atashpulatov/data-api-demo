import {SELECT_FOLDER, SELECT_OBJECT, SET_DATA_SOURCE, START_IMPORT} from '../navigation/navigation-tree-actions';
import {CLEAR_WINDOW} from '../popup/popup-actions';

export const initialState = {
    folder: null,
    chosenObjectId: null,
    chosenProjectId: null,
    chosenSubtype: null,
    dataSource: null,
    loading: false,
};

export const navigationTree = (state = initialState, action) => {
    switch (action.type) {
        case SELECT_OBJECT: {
            const newState = {...state};
            newState.chosenObjectId = action.data.chosenObjectId || null;
            newState.chosenProjectId = action.data.chosenProjectId || null;
            newState.chosenSubtype = action.data.chosenSubtype || null;
            return newState;
        }
        case SET_DATA_SOURCE: {
            const newState = {...state};
            newState.dataSource = action.data;
            return newState;
        }
        case SELECT_FOLDER: {
            const newState = {...state};
            newState.folder = action.data;
            return newState;
        }
        case CLEAR_WINDOW: {
            return {...initialState};
        }
        case START_IMPORT: {
            const newState = {...state};
            newState.loading = true;
            return newState;
        }
        default: {
            return state;
        }
    }
};
