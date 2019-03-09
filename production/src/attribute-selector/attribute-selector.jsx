import React, {Component} from 'react';
import {AttributeMetricFilter, ErrorBoundary} from 'mstr-react-library';

export class AttributeSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const {reportId, title, session, triggerUpdate, onTriggerUpdate, reportSubtype, resetTriggerUpdate, attributesSelectedChange} = this.props;
    return (
      <ErrorBoundary>
        <AttributeMetricFilter
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
