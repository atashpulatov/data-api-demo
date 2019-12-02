import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { ObjectTable, TopFilterPanel } from '@mstr/rc';
import { PopupButtons } from '../popup/popup-buttons';
import { browserActions } from './browser-actions';
import './browser.css';
import { connectToCache, createCache, refreshCache } from '../cache/cache-actions';

export const BrowserHOC = ({
  objects, projects, selected, onSelect, locale, sort, onSortChange, cache,
  filter, onFilterChange, myLibrary, onMyLibraryChange, t, connectToDB, initDB, refreshDB,
}) => {
  let DBConnection;
  const ua = window.navigator.userAgent;
  const isMSIE = ua.indexOf('MSIE ') > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./);
  const startDBListener = () => {
    if (cache.projects.length < 1 || cache.myLibrary.isLoading || cache.environmentLibrary.isLoading) {
      setTimeout(() => {
        connectToDB(true);
        startDBListener();
      }, 1000);
    } else {
      DBConnection.cancel();
    }
  };
  const connectToCacheMethod = useCallback(() => {
    DBConnection = connectToDB();
    if (isMSIE) startDBListener();
  });
  const refresh = () => {
    // eslint-disable-next-line no-unused-expressions
    DBConnection && DBConnection.cancel();
    refreshDB(initDB).then(() => {
      connectToCacheMethod();
    });
  };

  React.useEffect(() => connectToCacheMethod(), [connectToCacheMethod]);

  return (
    <div className="browser-wrapper">
      <div className="browser-top-panel">
        <div className="browser-title-bar">{t('Import Data')}</div>
        <TopFilterPanel
          isLoading={false}
          locale={locale}
          objects={objects}
          applications={projects}
          onFilterChange={onFilterChange}
          onSearch={() => {}} // TODO: Add proper function
          onSwitch={onMyLibraryChange}
          filter={filter}
          onRefresh={() => refresh()}
          myLibrary={myLibrary} />
      </div>
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
        searchText="" // TODO: Provide proper search text
        isLoading={false} />
      <PopupButtons />
    </div>
  );
};

BrowserHOC.propTypes = {
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
  onMyLibraryChange: PropTypes.func,
  t: PropTypes.func,
  initDB: PropTypes.func,
  connectToDB: PropTypes.func,
  refreshDB: PropTypes.func,
  cache: PropTypes.shape({})
};

BrowserHOC.defaultProps = { t: (text) => text };

export function mapStateToProps(state) {
  const cache = state.cacheReducer;
  const browsingData = state.browserReducer;
  return {
    projects: cache.projects,
    objects: browsingData.myLibrary ? cache.myLibrary.objects : cache.environmentLibrary.objects,
    myLibrary: browsingData.myLibrary,
    selected: browsingData.selected,
    sort: browsingData.sort,
    filter: browsingData.filter,
    cache,
  };
}

export const mapDispatchToProps = {
  ...browserActions,
  initDB: createCache,
  connectToDB: connectToCache,
  refreshDB: refreshCache,
};

export const Browser = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(BrowserHOC));
export default Browser;
