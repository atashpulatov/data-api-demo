import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

class BaseComponent extends Component {
    constructor(props) {
        super(props);
        if (this.props.location.state === undefined) {
            this.props.history.push({ pathname: '/' });
        } else {
            this.state = {
                origin: this.props.location.state.origin,
            };
        }
    }

    render() {
        return;
    }
};

export default BaseComponent;
