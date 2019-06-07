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
    const {title, session,
      triggerUpdate, onTriggerUpdate, mstrData,
      resetTriggerUpdate, attributesSelectedChange} = this.props;
    return (
      <ErrorBoundary>
        <AttributeMetricFilter
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
          openModal={this.props.openModal}
          closeModal={this.props.closeModal} />
      </ErrorBoundary>
    );
  }
}
