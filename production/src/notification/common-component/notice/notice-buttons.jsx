import React from 'react';

export const NoticeButtons = ({buttons, componentClass}) => {
  const getClassName = (type) => {
    switch (type) {
      case 'primary':
        return 'mstr-primary';
      case 'default':
        return 'mstr-default';
      default:
        return '';
    }
  };

  return (
    <div className={`${componentClass}-button-container`}>
      {buttons && buttons.map((button, index) => {
        return <button
          key={`${button.label}${index}`}
          onClick={button.action}
          className={getClassName(button.type)}>
          {button.label}
        </button>;
      })}
    </div>
  );
};
