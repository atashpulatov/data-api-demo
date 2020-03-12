import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CustomNotification extends Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
  }

  handleCollapse = () => {
    this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded, }));
  };

  render() {
    const { isExpanded } = this.state;
    const { details, translatedContent, t } = this.props;
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
          details && (
            <div>
              <nav className="error__nav">
                <div
                  onClick={this.handleCollapse}
                  onKeyUp={(e) => e.key === 'Enter' && this.handleCollapse}
                  className={config.actionClass}
                  role="button"
                  tabIndex="0"
                >
                  {t(config.message)}
                  <span className="error__arrow" />
                </div>
              </nav>
              <div
                className={`${config.messageClass} error__text`}
              >
                <p className="error__message">{details}</p>
              </div>
            </div>
          )
        }
      </section>
    );
  }
}

CustomNotification.propTypes = {
  details: PropTypes.string,
  translatedContent: PropTypes.string,
  t: PropTypes.func
};
