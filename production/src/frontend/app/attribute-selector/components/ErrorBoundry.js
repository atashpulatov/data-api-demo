import React from 'react';
import {Modal} from 'antd';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        this.setState({hasError: true});
        console.error(error, info);
    }

    onRefresh = () => {
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            Modal.error({
                title: 'MicroStrategy Data Connector',
                content: 'Oops, something went wrong!',
                onOk: this.onRefresh,
                okText: 'Restart',
            });
            return <div style={{height: '200px', width: '100%'}}></div>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
