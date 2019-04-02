import React, {Component} from 'react';
import {AttributeMetricFilter, ErrorBoundary} from 'mstr-react-library';
import {withTranslation} from 'react-i18next';

class _AttributeSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const {reportId, title, session, triggerUpdate, onTriggerUpdate, reportSubtype, resetTriggerUpdate, attributesSelectedChange, t} = this.props;
    return (
      <ErrorBoundary>
        <AttributeMetricFilter
          t={t}
          attributesSelectedChange={attributesSelectedChange}
          key={reportId}
          title={title}
          session={session}
          triggerUpdate={triggerUpdate}
          onTriggerUpdate={onTriggerUpdate}
          withDataPreview
          reportId={reportId}
          reportSubtype={reportSubtype}
          resetTriggerUpdate={resetTriggerUpdate}
          withFolderTree={false}
          openModal={this.props.openModal}
          closeModal={this.props.closeModal} />
      </ErrorBoundary>
    );
  }
}

export const AttributeSelector = withTranslation('common')(_AttributeSelector);
