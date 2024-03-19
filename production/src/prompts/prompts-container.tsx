import React, { useEffect } from 'react';

interface PromptsContainerProps {
  postMount: (container: HTMLElement) => void;
}

export const PromptsContainer: React.FC<PromptsContainerProps> = props => {
  const container = React.useRef();

  const { postMount } = props;

  useEffect(() => {
    postMount(container.current);
  }, [postMount]);

  return (
    <div
      ref={container}
      className='promptsContainer'
      style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}
    />
  );
};
