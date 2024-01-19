import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// TODO this component should be replaced with CC Overview component
const OverviewWindowNotConnected = (props) => {
  const { onRefresh, onDelete } = props;
  const { objects } = props;

  return (
    <div>
      <h1>Overview Demo Window</h1>
      <h3>Object list</h3>
      <ol>
        {objects.map((object) => (
          <li key={object.objectWorkingId}>
            <h5>{object.name}</h5>
            <button type="button" onClick={() => onRefresh([object.objectWorkingId])}>Refresh</button>
            <button type="button" onClick={() => onDelete([object.objectWorkingId])}>Delete</button>
          </li>
        ))}
      </ol>
      <div>
        <h2>Objects</h2>
      </div>
    </div>
  );
};

OverviewWindowNotConnected.propTypes = {
  onRefresh: PropTypes.func,
  onDelete: PropTypes.func,
  objects: PropTypes.arrayOf(PropTypes.shape({})),
};

export const mapStateToProps = ({ objectReducer }) => {
  const { objects } = objectReducer;

  return { objects };
};
export const mapActionsToProps = {};
export const OverviewWindow = connect(mapStateToProps, mapActionsToProps)(OverviewWindowNotConnected);
