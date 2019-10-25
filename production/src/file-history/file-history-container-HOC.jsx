import React from 'react';
import { popupController } from '../popup/popup-controller';
import { reduxStore } from '../store';
import { officeProperties } from '../office/office-properties';
import { CANCEL_REQUEST_IMPORT } from '../navigation/navigation-tree-actions';

export const fileHistoryContainerHOC = (Component) => {
  class _FileHistoryContainerHOC extends React.Component {
    state = { allowAddDataClick: true, };

    componentDidMount() {
      this._ismounted = true;
    }

    componentWillUnmount() {
      this._ismounted = false;
    }

    addDataAction = () => {
      // Prevent navigation tree from going straight into importing previously selected item.
      if (reduxStore.getState().navigationTree.importRequested) reduxStore.dispatch({ type: CANCEL_REQUEST_IMPORT });
      reduxStore.dispatch({ type: officeProperties.actions.startLoading });
      this.state.allowAddDataClick && this.setState({ allowAddDataClick: false }, async () => {
        await popupController.runPopupNavigation();
        this._ismounted && this.setState({ allowAddDataClick: true });
      });
    };

    render() {
      return <Component addDataAction={this.addDataAction} {...this.props} />;
    }
  }


  return _FileHistoryContainerHOC;
};
