/*eslint-disable */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import * as qs from 'query-string';
import './index.css';
import { projectRestService } from './project/project-rest-service';
/* eslint-enable */

const Office = window.Office;

function officeInitialize() {
  Office.onReady()
    .then(() => {
      goReact();
    });
}

class Popup extends Component {
  constructor(props) {
    super(props);

    const parsed = qs.parse(this.props.location.search);

    console.log(parsed);
    this.state = {
      txt: parsed.token,
    };
  }

  async componentDidMount() {
    try {
      const parsed = qs.parse(this.props.location.search);
      const projects = await projectRestService
        .getProjectList(parsed.envUrl, parsed.token);
      console.log(projects);
      // this.setState({
      //   txt: projects,
      // });
    } catch (err) {
      this.setState({
        txt: err,
      });
    };
  }

  render() {
    // Office.context.ui.messageParent(this.props.location);
    return (
      <div>
        <h1>
          {this.state.txt}
        </h1>
      </div>
    );
  }
}

function goReact() {
  ReactDOM.render(
    <BrowserRouter>
      <Route path="/" component={Popup} />
    </BrowserRouter>,
    document.getElementById('popup')
  );
}

officeInitialize();

registerServiceWorker();
