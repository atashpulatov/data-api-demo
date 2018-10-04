/* eslint-disable */
import React, { Component } from 'react';
import Parameters from './components/parameters.jsx';
import { msrtFetch } from './utilities/MSTRFetch';
import ErrorBoundary from './components/error-boundary.jsx';
/* esling-enable */

export class AttributeSelector extends Component {
    constructor(props) {
        super(props);
        this.api = msrtFetch;
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
