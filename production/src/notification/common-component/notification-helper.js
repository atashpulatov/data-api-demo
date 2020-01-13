import React from 'react';
import createChainedFunction from 'rc-util/lib/createChainedFunction';
import { Notice } from './notice';

export const createNoticeNodes = (notices, props, onRemove) => notices.map((notice, index) => {
  const update = Boolean(index === notices.length - 1 && notice.updateKey);
  const key = notice.updateKey ? notice.updateKey : notice.key;
  const onClose = createChainedFunction(() => onRemove(notice.key), notice.onClose);
  return (
    <Notice
        prefixCls={props.prefixCls}
        {...notice}
        key={key}
        update={update}
        onClose={onClose}
        onClick={notice.onClick}
        closeIcon={props.closeIcon}
        closeTimer={notice.closeTimer}>
      {notice.content}
    </Notice>
  );
});

export const getTransitionName = (props) => {
  let { transitionName } = props;
  if (!transitionName && props.animation) {
    transitionName = `${props.prefixCls}-${props.animation}`;
  }
  return transitionName;
};

let seed = 0;
const now = Date.now();

export const getUuid = () => `rcNotification_${now}_${seed++}`;
