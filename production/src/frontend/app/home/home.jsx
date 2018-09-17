/* eslint-disable */
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import { Routes } from './routes.jsx';
import { HashRouter as Router } from 'react-router-dom';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs.jsx';
import { Header } from './header.jsx';
import { MenuBar } from '../menu-bar/menu-bar.jsx';
import { Footer } from './footer.jsx';
import { FileHistoryContainer } from '../file-history/file-history-container.jsx';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import './home.css';
/* eslint-enable */

export class _Home extends Component {
  render() {
    return (
      <Router>
        <div id='content'>
          <Header />
          <MenuBar />
          <FileHistoryContainer />
          <Breadcrumbs />
          {/* TODO: create tests for spinner functionality */}
          <Spin spinning={this.props.loading}>
            <Routes />
          </Spin>
          <Footer />
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.sessionReducer.loading,
  };
}

export const Home = connect(mapStateToProps)(_Home);
