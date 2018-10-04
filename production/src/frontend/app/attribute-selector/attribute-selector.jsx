/* eslint-disable */
import React, { Component } from 'react';
import { Parameters, ErrorBoundary } from 'mstr-react';
/* esling-enable */

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
                <Parameters
                    key={'Mstr-parameters'}  // FIXME: rethink key generation
                    session={this.props.session}
                    triggerUpdate={this.props.triggerUpdate}
                    onTriggerUpdate={this.props.onTriggerUpdate}
                    withDataPreview
                    reportId={this.props.reportId} />
            </ErrorBoundary>
        );
    }
}
