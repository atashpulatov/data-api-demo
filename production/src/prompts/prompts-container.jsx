import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export const PromptsContainer = (props) => {
  const container = React.useRef();
  const { postMount } = props;

  useEffect(() => {
    postMount(container.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={container} className="promptsContainer" style={{ height: '100vh', position: 'relative', overflow: 'hidden' }} />
  );
};

PromptsContainer.propTypes = { postMount: PropTypes.func };
