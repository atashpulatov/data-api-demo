import React from 'react';
import { popupController } from '../popup/popup-controller';
import { reduxStore } from '../store';
import { officeProperties } from '../office/office-properties';
import { CANCEL_REQUEST_IMPORT, SWITCH_MY_LIBRARY, CANCEL_DOSSIER_OPEN } from '../navigation/navigation-tree-actions';
import { officeApiHelper } from '../office/office-api-helper';
import { errorService } from '../error/error-handler';
import { ProtectedSheetError } from '../error/protected-sheets-error';

export const fileHistoryContainerHOC = (Component) => {
  class _FileHistoryContainerHOC extends React.Component {
    state = { allowAddDataClick: true, };

    componentDidMount() {
      this._ismounted = true;
    }

    componentWillUnmount() {
      this._ismounted = false;
    }

    addDataAction = async () => {
      try {
        // Check if current sheet is protected. If yes, send error
        const excelContext = await officeApiHelper.getExcelContext();
        const currentSheet = await officeApiHelper.getCurrentExcelSheet(excelContext);
        const isSheetProtected = await officeApiHelper.isSheetProtected(excelContext, currentSheet);
        if (isSheetProtected) {
          throw new ProtectedSheetError();
        }

        // Prevent navigation tree from going straight into importing previously selected item.
        if (reduxStore.getState().navigationTree.importRequested) reduxStore.dispatch({ type: CANCEL_REQUEST_IMPORT });
        if (reduxStore.getState().navigationTree.myLibrary) reduxStore.dispatch({ type: SWITCH_MY_LIBRARY });
        if (reduxStore.getState().navigationTree.dossierOpenRequested) reduxStore.dispatch({ type: CANCEL_DOSSIER_OPEN });
        reduxStore.dispatch({ type: officeProperties.actions.startLoading });
        this.state.allowAddDataClick && this.setState({ allowAddDataClick: false }, async () => {
          await popupController.runPopupNavigation();
          this._ismounted && this.setState({ allowAddDataClick: true });
        });
      } catch (error) {
        errorService.handleError(error);
      }
    };

    render() {
      return <Component addDataAction={this.addDataAction} {...this.props} />;
    }
  }


  return _FileHistoryContainerHOC;
};
