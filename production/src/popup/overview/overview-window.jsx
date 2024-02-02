import React from 'react';
import { connect } from 'react-redux';
import { DataOverview } from '@mstr/connector-components';
import PropTypes from 'prop-types';
import './overview-window.scss';

const OverviewWindowNotConnected = (props) => {
  const { onRefresh, onDelete } = props;
  const { objects } = props;

  return (
    <div className="data-overview-wrapper">
      <DataOverview loadedObjects={objects} applicationType="EXCEL" onRefresh={onRefresh} onDelete={onDelete} />
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
