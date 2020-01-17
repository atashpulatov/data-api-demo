import React, { Component } from 'react';
import { AttributeMetricFilter, ErrorBoundary } from '@mstr/mstr-react-library';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { reduxStore } from '../store';

export class AttributeSelectorHOC extends Component {
  constructor(props) {
    super(props);
    this.handleUnauthorized = this.handleUnauthorized.bind(this);
  }

  /**
   * Handles unathorized error from library - rearrange
   * properties to be compatible with errorService.handleError
   *
   * @param {Error} e -  Error thrown by mstrReactLibrary
   */
  handleUnauthorized(e) {
    const { handlePopupErrors } = this.props;
    const newErrorObject = {
      status: e.status,
      response: {
        ...e.response,
        body: {
          code: 'ERR009',
          message: 'The user\'s session has expired, please reauthenticate',
        },
        text: '{"code":"ERR009","message":"The user\'s session has expired, please reauthenticate"}',
      }
    };
    handlePopupErrors(newErrorObject);
  }

  render() {
    const { officeReducer: { supportForms } } = reduxStore.getState();
    const {
      title, session,
      triggerUpdate, onTriggerUpdate, mstrData,
      resetTriggerUpdate, attributesSelectedChange, t, openModal, closeModal, toggleSubtotal,
    } = this.props;
    const mstrDataOffice = { ...mstrData, supportForms };

    return (
      <ErrorBoundary>
        <AttributeMetricFilter
          t={t}
          attributesSelectedChange={attributesSelectedChange}
          key={mstrData.reportId}
          title={title}
          session={session}
          mstrData={mstrDataOffice}
          triggerUpdate={triggerUpdate}
          onTriggerUpdate={onTriggerUpdate}
          withDataPreview
          resetTriggerUpdate={resetTriggerUpdate}
          withFolderTree={false}
          openModal={openModal}
          closeModal={closeModal}
          toggleSubtotal={toggleSubtotal}
          importSubtotal={mstrData.subtotalsInfo && mstrData.subtotalsInfo.importSubtotal}
          handleUnauthorized={this.handleUnauthorized}
        />
      </ErrorBoundary>
    );
  }
}

AttributeSelectorHOC.propTypes = {
  title: PropTypes.string,
  triggerUpdate: PropTypes.bool,
  openModal: PropTypes.bool,
  session: PropTypes.shape({}),
  mstrData: PropTypes.shape({
    reportId: PropTypes.string,
    subtotalsInfo: PropTypes.object,
    importSubtotal: PropTypes.bool
  }),
  resetTriggerUpdate: PropTypes.func,
  attributesSelectedChange: PropTypes.func,
  closeModal: PropTypes.func,
  toggleSubtotal: PropTypes.func,
  handlePopupErrors: PropTypes.func,
  onTriggerUpdate: PropTypes.func,
  t: PropTypes.func
};
AttributeSelectorHOC.defaultProps = { t: (text) => text, };

export const AttributeSelector = withTranslation('common')(AttributeSelectorHOC);
