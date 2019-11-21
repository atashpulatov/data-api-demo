import React, { Component } from 'react';
import { AttributeMetricFilter, ErrorBoundary } from '@mstr/mstr-react-library';
import { withTranslation } from 'react-i18next';

export class _AttributeSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, };
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
    const {
      title, session,
      triggerUpdate, onTriggerUpdate, mstrData,
      resetTriggerUpdate, attributesSelectedChange, t, openModal, closeModal, toggleSubtotal,
    } = this.props;

    return (
      <ErrorBoundary>
        <AttributeMetricFilter
          t={t}
          attributesSelectedChange={attributesSelectedChange}
          key={mstrData.reportId}
          title={title}
          session={session}
          mstrData={mstrData}
          triggerUpdate={triggerUpdate}
          onTriggerUpdate={onTriggerUpdate}
          withDataPreview
          resetTriggerUpdate={resetTriggerUpdate}
          withFolderTree={false}
          openModal={openModal}
          closeModal={closeModal}
          toggleSubtotal={toggleSubtotal}
          importSubtotal={mstrData.importSubtotal}
          handleUnauthorized={this.handleUnauthorized}
        />
      </ErrorBoundary>
    );
  }
}

_AttributeSelector.defaultProps = { t: (text) => text, };

export const AttributeSelector = withTranslation('common')(_AttributeSelector);
