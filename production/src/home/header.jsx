import React, {Component} from 'react';
import logo from './assets/mstr_logo.png';
import {sessionHelper} from '../storage/session-helper';
import {Button} from 'antd';
import {errorService} from '../error/error-handler';
import {connect} from 'react-redux';
import {userRestService} from './user-rest-service';


export class _Header extends Component {
  constructor(props) {
    super(props);
    this.state = {userData: {}, class: ''};
  }

  componentDidMount = async () => {
    const {envUrl, authToken} = this.props;
    try {
      this.setState({userData: await userRestService.getUserData(authToken, envUrl)});
    } catch (error) {
      errorService.handleError(error, true);
    }
    sessionHelper.saveUserInfo(this.state.userData);
    this.setState({class: 'gotUserData'});
  }

  render() {
    const {userFullName, userInitials} = this.props;
    return (
      <header id='app-header'>
        <span id='profileImage' className={this.state.class}>
          {userInitials !== null ?
            <span id='initials' alt='User profile'>{userInitials}</span> :
            <img src={logo} alt='User profile' />
            /* TODO: When rest api returns profileImage use it as source*/}
        </span>
        <span className={` ${this.state.class} header-name`}>{userFullName}</span>
        <Button id='logOut' onClick={logout} size='small'>Log out</Button>
      </header >
    );
  };
}

function mapStateToProps(state) {
  const {userFullName, userInitials, envUrl, authToken} = state.sessionReducer;
  return {userFullName, userInitials, envUrl, authToken};
};

export const Header = connect(mapStateToProps)(_Header);

function logout() {
  try {
    sessionHelper.logOutRest();
    sessionHelper.logOut();
    sessionHelper.logOutRedirect();
  } catch (error) {
    errorService.handleError(error);
  }
}

