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
    const {text, translatedContent} = this.props;
    const actionClass = !isExpanded ? 'error__show-more' : 'error__show-less';
    const messageClass = !isExpanded ? 'error__text-hidden' : 'error__text-shown';
    const message = !isExpanded ? 'Show more' : 'Show less';
    return (
      <section className="error__section">
        <header className="error__header">{translatedContent}</header>
        {
          text && <div>
            <p
              onClick={this.handleCollapse}
              className={actionClass}>
              {message}<span className="error__arrow"></span>
            </p>
            <div
              className={`${messageClass} error__text`}>
              <p className="error__message">{text}</p>
            </div>
          </div>
        }
      </section >
    );
  }
};

