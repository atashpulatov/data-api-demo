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
    const {details, translatedContent, t} = this.props;
    const config = !isExpanded ? {
      actionClass: 'error__show-more',
      messageClass: 'error__text-hidden',
      message: 'Show more',
    } : {
      actionClass: 'error__show-less',
      messageClass: 'error__text-shown',
      message: 'Show less',
    };

    return (
      <section className="error__section">
        <header className="error__header">{translatedContent}</header>
        {
          details && <div>
            <nav className="error__nav">
              <p
                onClick={this.handleCollapse}
                className={config.actionClass}>
                {t(config.message)}<span className="error__arrow"></span>
              </p>
            </nav>
            <div
              className={`${config.messageClass} error__text`}>
              <p className="error__message">{details}</p>
            </div>
          </div>
        }
      </section >
    );
  }
};

