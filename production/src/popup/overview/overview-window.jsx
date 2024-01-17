/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { reduxStore } from '../../store';
import { updateObject } from '../../redux-reducer/object-reducer/object-actions';

const OverviewWindowNotConnected = (props) => {
  const { onRefresh, onDelete } = props;
  const { objects } = props;

  useEffect(() => {
    console.log('objects: ', objects);
  }, [objects]);

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

export const mapStateToProps = ({ objectReducer }) => {
  const { objects } = objectReducer;

  return { objects };
};
export const mapActionsToProps = {};
export const OverviewWindow = connect(mapStateToProps, mapActionsToProps)(OverviewWindowNotConnected);
