import React, { Component } from 'react';

export class PromptsContainer extends Component {
    constructor(props){
        super(props);
        this.container = React.createRef();
    }

    componentDidMount = () => {
        this.props.postMount(this.container.current);
    }

    render() {
        return (
            <div ref={this.container} className="promptsContainer"></div>
        )
    }
}