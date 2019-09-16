import React from 'react';
import { connect } from 'react-redux';
export default class _EmbeddedDossier extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  render() {
    return (
      <div ref={this.container} />
    );
  }
}

export const EmbeddedDossier = connect()(_EmbeddedDossier);
