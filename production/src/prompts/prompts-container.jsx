import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class PromptsContainer extends Component {
  constructor() {
    super();
    this.container = React.createRef();
  }

  componentDidMount = () => {
    const { postMount } = this.props;
    postMount(this.container.current);
  };

  render() {
    return (
      <div ref={this.container} className="promptsContainer" style={{ height: '100vh', position: 'relative', overflow: 'hidden' }} />
    );
  }
}

PromptsContainer.propTypes = { postMount: PropTypes.func };
