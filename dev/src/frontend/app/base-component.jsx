import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

export class BaseComponent extends Component {
    constructor(props) {
        super(props);
        if (this.props.location.state === undefined) {
            this.state = {};
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
