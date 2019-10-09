import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { ObjectBrowser } from '@mstr/rc/dist';
import { PopupButtons } from '../popup/popup-buttons';
import { browserActions } from './browser-actions';

// eslint-disable-next-line no-underscore-dangle
export const _Browser = ({
  objects, projects, selected, onSelect, locale, sort, onSortChange,
  filter, onFilterChange, myLibrary, onMyLibraryChange
}) => (
  <>
    <ObjectBrowser
        onSortChange={onSortChange}
        sort={sort}
        objects={objects.objects}
        projects={projects}
        selected={selected}
        onSelect={onSelect}
        locale={locale}
        // searchText={text('searchText', 'photo')}
        filter={filter}
        onFilterChange={onFilterChange}
        myLibrary={myLibrary}
        onMyLibraryChange={onMyLibraryChange}
        isLoading={objects.isLoading}
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
  onFilterChange: PropTypes.func.isRequired,
  myLibrary: PropTypes.bool,
};

export function mapStateToProps(state) {
  const cachedData = state.cacheReducer;
  const browsingData = state.browserReducer;
  return {
    projects: cachedData.projects,
    objects: browsingData.myLibrary ? cachedData.myLibrary : cachedData.environmentLibrary,
    myLibrary: browsingData.myLibrary,
    selected: browsingData.selected,
    sort: browsingData.sort,
    filter: browsingData.filter,
  };
}

export const mapDispatchToProps = { ...browserActions };

export const Browser = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_Browser));
export default Browser;
