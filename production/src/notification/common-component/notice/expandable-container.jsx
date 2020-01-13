import React from 'react';
import { ArrowUpIcon } from '../icon/arrow_up';
import { ArrowDownIcon } from '../icon/arrow_down';

// eslint-disable-next-line max-lines-per-function
export const ExpandableContainer = ({ props, componentClass }) => {
  const [isExpanded, setExpanded] = React.useState(false);

  const { showLessLabel, showMoreLabel, content } = props;

  const handleClick = () => setExpanded(!isExpanded);

  const getButtonLabel = () => (isExpanded ? showLessLabel : showMoreLabel);

  const getArrowIcon = () => {
    const iconProps = {
      className: `${componentClass}-icon`,
      onClick: handleClick,
    };
    if (isExpanded) {
      return <ArrowUpIcon {...iconProps} />;
    }
    return <ArrowDownIcon {...iconProps} />;
  };

  return (
    <div className={componentClass}>
      <div className={`${componentClass}-toggle`}>
        <button className={`${componentClass}-button`} onClick={handleClick}>
          {getButtonLabel()}
        </button>
        {getArrowIcon()}
      </div>
      {isExpanded
        && (
        <div className={`${componentClass}-content`}>
          {content}
        </div>
)}
    </div>
  );
};
