import React, {Component} from 'react';
import {AttributeMetricFilter, ErrorBoundary} from '@mstr/mstr-react-library';
import {withTranslation} from 'react-i18next';

export class _AttributeSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const {title, session,
      triggerUpdate, onTriggerUpdate, mstrData,
      resetTriggerUpdate, attributesSelectedChange, t} = this.props;
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
          openModal={this.props.openModal}
          closeModal={this.props.closeModal} />
      </ErrorBoundary>
    );
  }
}

_AttributeSelector.defaultProps = {
  t: (text) => text,
};

export const AttributeSelector = withTranslation('common')(_AttributeSelector);
