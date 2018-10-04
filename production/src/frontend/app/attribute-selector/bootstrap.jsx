/* eslint-disable */
import React, { Component } from 'react';
import Parameters from './components/Parameters';
import { msrtFetch } from './utilities/MSTRFetch';
import { reduxStore } from '../store';
import './Bootstrap.css';
import ErrorBoundary from './components/ErrorBoundry';
import { sessionHelper } from '../storage/session-helper';
/* esling-enable */

export class Bootstrap extends Component {
    constructor(props) {
        super(props);
        this.api = msrtFetch;
        this.state = {
            loading: false,
        };
    }

    render() {
        const session = sessionHelper.getSession();
        return (
            <ErrorBoundary>
                <Parameters
                    key={'Mstr-parameters'}  // FIXME: rethink key generation
                    session={session}
                    triggerUpdate={this.props.triggerUpdate}
                    onTriggerUpdate={this.props.onTriggerUpdate}
                    withDataPreview
                    reportId={this.props.reportId} />
            </ErrorBoundary>
        );
    }
}
