import React, { Component } from 'react';

export class PromptsContainer extends Component {
  constructor() {
    super();
    this.container = React.createRef();
  }

    componentDidMount = () => {
      this.props.postMount(this.container.current);
    }

    render() {
      return (
        <div ref={this.container} className='promptsContainer' style={{ height: '100vh', position: 'relative', overflow: 'hidden' }} />
      );
    }
}
