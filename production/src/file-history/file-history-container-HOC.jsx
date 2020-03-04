import React from 'react';
import { popupController } from '../popup/popup-controller';
import { reduxStore } from '../store';
import { officeProperties } from '../office/store/office-properties';
import {
  CANCEL_REQUEST_IMPORT,
  CANCEL_DOSSIER_OPEN
} from '../navigation/navigation-tree-actions';
import { officeApiHelper } from '../office/api/office-api-helper';
import { errorService } from '../error/error-handler';
import { officeApiWorksheetHelper } from '../office/api/office-api-worksheet-helper';

export const fileHistoryContainerHOC = Component => {
  class _FileHistoryContainerNotConnected extends React.Component {
    constructor() {
      super();
      this.state = { allowAddDataClick: true };
    }

    componentDidMount() {
      this.ismounted = true;
    }

    componentWillUnmount() {
      this.ismounted = false;
    }

    addDataAction = async () => {
      const { allowAddDataClick } = this.state;
      try {
        const excelContext = await officeApiHelper.getExcelContext();
        await officeApiWorksheetHelper.isCurrentReportSheetProtected(excelContext);
        const { navigationTree } = reduxStore.getState();

        // Prevent navigation tree from going straight into importing previously selected item.
        if (navigationTree.importRequested) { reduxStore.dispatch({ type: CANCEL_REQUEST_IMPORT }); }
        // if (navigationTree.myLibrary) reduxStore.dispatch({ type: SWITCH_MY_LIBRARY });
        if (navigationTree.dossierOpenRequested) { reduxStore.dispatch({ type: CANCEL_DOSSIER_OPEN }); }
        reduxStore.dispatch({ type: officeProperties.actions.startLoading });
        if (allowAddDataClick) {
          this.setState({ allowAddDataClick: false }, async () => {
            await popupController.runPopupNavigation();
            if (this.ismounted) { this.setState({ allowAddDataClick: true }); }
          });
        }
      } catch (error) {
        errorService.handleError(error);
      }
    };

    render() {
      return <Component addDataAction={this.addDataAction} {...this.props} />;
    }
  }

  return _FileHistoryContainerNotConnected;
};
