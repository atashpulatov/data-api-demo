import React from 'react';
import { popupController } from '../popup/popup-controller';

export const fileHistoryContainerHOC = (Component) => {
  class _FileHistoryContainerHOC extends React.Component {
        state = {
          allowAddDataClick: true,
        };

        componentDidMount() {
          this._ismounted = true;
        }

        componentWillUnmount() {
          this._ismounted = false;
        }

        addDataAction = () => {
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
