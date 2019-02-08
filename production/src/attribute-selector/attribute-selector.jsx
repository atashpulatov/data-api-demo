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
    const {reportId, title, session, triggerUpdate, onTriggerUpdate} = this.props;
    return (
      <ErrorBoundary>
        <AttributeMetricFilter
          key={reportId}
          title={title}
          session={session}
          triggerUpdate={triggerUpdate}
          onTriggerUpdate={onTriggerUpdate}
          withDataPreview
          reportId={reportId}
          withFolderTree={false} />
      </ErrorBoundary>
    );
  }
}
