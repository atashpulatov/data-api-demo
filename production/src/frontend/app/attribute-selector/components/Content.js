import React, {Component} from 'react';
import {Collapse, Button} from 'antd';
import SectionBox from './SectionBox';
import Authentication from './Authentication';
import Parameters from './Parameters';
import ErrorBoundary from './ErrorBoundry';


import MSTRCallback from '../utilities/MSTRCallback';
const mode = new MSTRCallback('mode');

const Panel = Collapse.Panel;

class Content extends Component {
    constructor(props) {
        super(props);
        this.auth = React.createRef();
        this.parameters = React.createRef();
    }

    validateForm = () => {
        return this.auth.current.validateFields;
    }

    showModal = () => {
        this.parameters.current.showModal();
    }

    submit = () => {
        if (mode.parameter === 'tableau') {
            this.parameters.current.tableauSubmit();
        } else {
            this.parameters.current.mstrSubmit();
        }
    }

    getFormValidity = (fieldsError) => {
        this.props.changeDisabledConnect(Object.keys(fieldsError).some((field) => fieldsError[field]));
    }

    render() {
        return (
            <ErrorBoundary>
                <div className='main-content'>
                    <Collapse bordered={false} accordion activeKey={this.props.api.isAuthenticated ? 'params' : 'config'} >
                        <Panel header='URL Configuration' key='config' disabled={!!this.props.api.isAuthenticated}>
                            <SectionBox>
                                <Authentication ref={this.auth} handleSubmit={this.props.handleSubmit} getFormValidity={this.getFormValidity} />
                            </SectionBox>
                        </Panel>
                        <Panel header='Parameters' key='params' disabled={!this.props.api.isAuthenticated}>
                            <SectionBox>
                                <Parameters
                                    key={this.props.api.url}
                                    changeDisabledSubmit={this.props.changeDisabledSubmit}
                                    api={this.props.api}
                                    ref={this.parameters} />
                                <div className='h-divider'></div>
                                <Button className='preview-button' icon='table' onClick={this.showModal}>Data Preview</Button>
                            </SectionBox>
                        </Panel>
                    </Collapse>
                </div >
            </ErrorBoundary>
        );
    }
}

export default Content;
