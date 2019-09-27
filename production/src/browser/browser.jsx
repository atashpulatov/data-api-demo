import React from 'react';
import PropTypes from 'prop-types';
import { ObjectTable } from '@mstr/rc';
import { PopupButtons } from '../popup/popup-buttons';

export const _Browser = ({
  objects, projects, selected, onSelect, locale, sort, onSortChange, filter, myLibrary,
}) => (
  <>
      <ObjectTable
        objects={objects}
        projects={projects}
        sort={sort}
        onSortChange={onSortChange}
        selected={selected}
        onSelect={onSelect}
        locale={locale}
        filter={filter}
        myLibrary={myLibrary}
      />
      <PopupButtons />
    </>
);
_Browser.propTypes = {
  objects: PropTypes.arrayOf(PropTypes.object).isRequired,
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.shape({
    id: PropTypes.string,
    projectId: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  locale: PropTypes.string,
  sort: PropTypes.shape({
    sortBy: PropTypes.string.isRequired,
    sortDirection: PropTypes.string.isRequired,
  }),
  onSortChange: PropTypes.func.isRequired,
  filter: PropTypes.shape({
    projects: PropTypes.arrayOf(PropTypes.string),
    types: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.number,
      subtypes: PropTypes.arrayOf(PropTypes.number),
    })),
    certified: PropTypes.bool,
    owners: PropTypes.arrayOf(PropTypes.string),
    dateModified: PropTypes.shape({
      from: PropTypes.object,
      to: PropTypes.object,
    }),
  }),
  myLibrary: PropTypes.bool,
};

export function mapStateToProps(state) {
  const cachedData = state.cacheReducer;
  const browsingData = state.browserReducer;
  return {
    projects: cachedData.projects,
    objects: browsingData.myLibrary ? cachedData.myLibrary : cachedData.environmentLibrary,
    myLibrary: browsingData.myLibrary,
  };
}

export default _Browser;
