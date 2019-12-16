import React from 'react';
import { ExpandableContainer } from './expandable-container.jsx.js.js.js';

export const NoticeContent = ({ props, componentClass }) => {
  const { icon, children, expandable } = props;
  return (
    <div className={`${componentClass}-container`}>
      {icon
        && (
        <div tabIndex="-1" className={`${componentClass}-icon`}>
  {icon}
</div>
)}
      <div className={`${componentClass}-content`}>
        <div className={`${componentClass}-text`}>
          {children}
        </div>
        {props.expandable
          && <ExpandableContainer props={expandable} componentClass={`${componentClass}-expandable-container`} />}
      </div>
    </div>
  );
};
