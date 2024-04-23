import { createSelector } from 'reselect';

import { RootState } from '../../store';

import { NavigationTreeState } from './navigation-tree-reducer-types';

const getNavigationTreeState = (state: RootState): NavigationTreeState => state.navigationTree;

const selectMstrObjectType = createSelector(
  [getNavigationTreeState],
  navigationTree => navigationTree.mstrObjectType
);

const selectIsObjectSelected = createSelector(
  [getNavigationTreeState],
  navigationTree => navigationTree.chosenObjectId !== null
);

const selectIsDossierOpenRequested = createSelector(
  [getNavigationTreeState],
  navigationTree => navigationTree.dossierOpenRequested
);

const selectArePromptAnswered = createSelector(
  [getNavigationTreeState],
  navigationTree => !!navigationTree.dossierData
);

const selectIsEdit = createSelector(
  [getNavigationTreeState],
  navigationTree => navigationTree.isEdit
);

const selectPageBy = createSelector(
  [getNavigationTreeState],
  navigationTree => navigationTree.pageBy
);

const selectChosenObjectName = createSelector(
  [getNavigationTreeState],
  navigationTree => navigationTree.chosenObjectName
);

const selectIsPageByModalOpenRequested = createSelector(
  [getNavigationTreeState],
  navigationTree => navigationTree.pageByModalOpenRequested
);

const selectImportPageByConfigurations = createSelector(
  [getNavigationTreeState],
  navigationTree => navigationTree.importPageByConfigurations
);

export const navigationTreeSelectors = {
  selectMstrObjectType,
  selectIsObjectSelected,
  selectIsDossierOpenRequested,
  selectArePromptAnswered,
  selectIsEdit,
  selectPageBy,
  selectChosenObjectName,
  selectIsPageByModalOpenRequested,
  selectImportPageByConfigurations,
};
