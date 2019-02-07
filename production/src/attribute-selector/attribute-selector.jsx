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
    return (
      <ErrorBoundary>
        <AttributeMetricFilter
          key={this.props.reportId}
          session={this.props.session}
          triggerUpdate={this.props.triggerUpdate}
          onTriggerUpdate={this.props.onTriggerUpdate}
          withDataPreview
          reportId={this.props.reportId}
          withFolderTree={false} />
      </ErrorBoundary>
    );
  }
}
