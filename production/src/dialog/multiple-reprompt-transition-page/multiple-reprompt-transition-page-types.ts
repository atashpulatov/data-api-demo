import { EditedObject } from '../../redux-reducer/popup-reducer/popup-reducer-types';

export interface MultipleRepromptTransitionPageTypes {
  nextObjectBindId: string;
  nextObjectIndex: number;
  total: number;
  popupData: {
    objectWorkingId: number;
  };
  editedObject: EditedObject;
}
