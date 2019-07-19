import React, {Component} from 'react';

export default class CustomNotification extends Component {
  state = {
    isExpanded: false,
  }

  handleCollapse = () => {
    this.setState(({isExpanded}) => {
      return {
        isExpanded: !isExpanded,
      };
    });
  };

  render() {
    const {isExpanded} = this.state;
    const actionClass = !isExpanded ? 'show-more' : 'show-less';
    const messageClass = !isExpanded ? 'text-hidden' : 'text-shown';
    const message = !isExpanded ? 'Show more' : 'Show less';
    const text = `{"code": "ERR017","iServerCode":-2147214568,"message":"(User 'Kepka, Iwo' does not have Execute access to the Report Definition object 'PD Cube' in Project Rally Analytics with ID '0730F68F4B8B4B52AA23F0AAB46F3CA8'.) ","ticketId":"408928e076c2426fb8060c61698c12d2"}`;
    return (
      <section style={{width: '234px', marginTop: '3px'}}>
        <header style={{fontSize: '12px'}}><strong>Human Resources Annual Report</strong> could not be refreshed!</header>
        <div>
          <p onClick={this.handleCollapse} className={actionClass}>{message}<span className="show-more-arrow"></span></p>
          <div className={messageClass}>{text}</div>
        </div>
      </section >
    );
  }
};

