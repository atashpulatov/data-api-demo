import React, { Component } from 'react';
import { objectTypes, FolderBrowser } from '@mstr/mstr-react-library';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { ObjectTable, TopFilterPanel } from '@mstr/rc';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupButtons } from '../popup/popup-buttons';
import { actions } from './navigation-tree-actions';
import { isPrompted as checkIfPrompted } from '../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import './navigation-tree.css';
import { connectToCache, refreshCache, createCache } from '../cache/cache-actions';

const DB_TIMEOUT = 2500; // Interval for checking indexedDB changes on IE

export class _NavigationTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      triggerUpdate: false,
      previewDisplay: false,
    };
    const ua = window.navigator.userAgent;
    this.isMSIE = ua.indexOf('MSIE ') > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./);
  }

  componentDidMount() {
    this.connectToCache();
  }

  connectToCache = () => {
    const { connectToDB } = this.props;
    this.DBConnection = connectToDB();
    if (this.isMSIE) this.startDBListener();
  };

  startDBListener = () => {
    const { cache, connectToDB } = this.props;
    if (cache.projects.length < 1 || cache.myLibrary.isLoading || cache.environmentLibrary.isLoading) {
      setTimeout(() => {
        connectToDB(true);
        this.startDBListener();
      }, DB_TIMEOUT);
    } else {
      this.DBConnection.cancel();
    }
  };

  refresh = () => {
    this.DBConnection.cancel();
    const { refreshDB, initDB } = this.props;
    refreshDB(initDB)
      .then(() => {
        this.connectToCache();
      });
  };

  handleOk = () => {
    const { objectType, requestImport, requestDossierOpen } = this.props;
    if (objectType.name === mstrObjectEnum.mstrObjectType.dossier.name) {
      requestDossierOpen();
    } else {
      requestImport();
    }
  };

  onTriggerUpdate = (body) => {
    const updateObject = {
      command: selectorProperties.commandOnUpdate,
      body,
    };
    window.Office.context.ui.messageParent(JSON.stringify(updateObject));
  };

  handleSecondary = async () => {
    try {
      const { chosenProjectId, chosenObjectId, chosenProjectName, chosenType, chosenSubtype, handlePrepare } = this.props;
      handlePrepare(chosenProjectId, chosenObjectId, chosenSubtype, chosenProjectName, chosenType);
      this.setState({ previewDisplay: true });
    } catch (err) {
      const { handlePopupErrors } = this.props;
      handlePopupErrors(err);
    }
  };

  handleCancel = () => {
    const { stopLoading } = this.props;
    stopLoading();
    const cancelObject = { command: selectorProperties.commandCancel };
    window.Office.context.ui.messageParent(JSON.stringify(cancelObject));
  };

  // TODO: temporary solution
  onObjectChosen = async (objectId, projectId, subtype) => {
    try {
      const { selectObject } = this.props;
      selectObject({
        chosenObjectId: null,
        chosenProjectId: null,
        chosenSubtype: null,
        isPrompted: null,
        objectType: null,
      });

      // Only check for prompts when it's a report or dossier
      let isPrompted = false;
      const objectType = mstrObjectEnum.getMstrTypeBySubtype(subtype);
      if ((objectType === mstrObjectEnum.mstrObjectType.report) || (objectType === mstrObjectEnum.mstrObjectType.dossier)) {
        isPrompted = await checkIfPrompted(objectId, projectId, objectType.name);
      }

      selectObject({
        chosenObjectId: objectId,
        chosenProjectId: projectId,
        chosenSubtype: subtype,
        isPrompted,
        objectType,
      });
    } catch (err) {
      const { handlePopupErrors } = this.props;
      handlePopupErrors(err);
    }
  };

  render() {
    const {
      chosenObjectId, chosenProjectId, changeSorting, loading, handlePopupErrors, searchText, sorter,
      changeSearching, objectType, cache, filter, myLibrary, switchMyLibrary, changeFilter, t, i18n,
    } = this.props;
    const { triggerUpdate, previewDisplay } = this.state;
    const objects = myLibrary ? cache.myLibrary.objects : cache.environmentLibrary.objects;

    return (
      <div className="navigation_tree__main_wrapper">
        <div className="navigation_tree__title_bar">
          <span>{t('Import Data')}</span>
          <TopFilterPanel
            locale={i18n.language}
            objects={objects}
            applications={cache.projects}
            onFilterChange={changeFilter}
            onSearch={changeSearching}
            isLoading={loading}
            myLibrary={myLibrary}
            filter={filter}
            onRefresh={() => this.refresh()}
            onSwitch={switchMyLibrary} />
        </div>
        <ObjectTable
          objects={objects}
          projects={cache.projects}
          selected={{
            id: chosenObjectId,
            projectId: chosenProjectId,
          }}
          onSelect={({ id, projectId, subtype }) => this.onObjectChosen(id, projectId, subtype)}
          sort={sorter}
          onSortChange={changeSorting}
          locale={i18n.language}
          searchText={searchText}
          filter={filter}
          isLoading={loading} />
        <PopupButtons
          loading={loading}
          disableActiveActions={!chosenObjectId}
          handleOk={this.handleOk}
          handleSecondary={this.handleSecondary}
          handleCancel={this.handleCancel}
          previewDisplay={previewDisplay}
          disableSecondary={objectType && objectType.name === mstrObjectEnum.mstrObjectType.dossier.name}
        />
        {/* Temporary loading user action block */}
        <div
          id='action-block'
          style={{
            display: loading ? 'block' : 'none',
            position: 'fixed',
            top: '0',
            left: '0',
            height: '100vh',
            width: '100vw',
            zindex: '100',
            backgroundColor: '#fff',
            opacity: '0.5',
          }}
        />
        <div className='navigation_tree__main_wrapper'>
          <div className='navigation_tree__title_bar'>{t('Import Data')}</div>
          {/* <div className="navigation_tree__table_wrapper" style={{ fontSize: 12 }}> */}
          <div style={{ padding: 64, fontSize: 20 }}>
            <p>
              Projects:
              {' '}
              {cache.projects.length}
            </p>
            <br />
            <p>
              My Library
              {' '}
              {cache.myLibrary.isLoading ? '(loading):' : ':'}
              {' '}
              {cache.myLibrary.objects.length}
            </p>
            <br />
            <p>
              Environment Library
              {' '}
              {cache.environmentLibrary.isLoading ? '(loading):' : ':'}
              {' '}
              {cache.environmentLibrary.objects.length}
            </p>
            <button type='button' onClick={this.refresh}>Refresh</button>

          </div>
          <PopupButtons
            loading={loading}
            disableActiveActions={!chosenObjectId}
            handleOk={this.handleOk}
            handleSecondary={this.handleSecondary}
            handleCancel={this.handleCancel}
            previewDisplay={previewDisplay}
            disableSecondary={objectType && objectType.name === mstrObjectEnum.mstrObjectType.dossier.name}
          />
        </div>
      </div>
    );
  }
}

_NavigationTree.defaultProps = { t: (text) => text };

export const mapStateToProps = ({ officeReducer, navigationTree, cacheReducer }) => {
  const object = officeReducer.preLoadReport;
  return {
    ...navigationTree,
    title: object ? object.name : undefined,
    cache: cacheReducer,
  };
};

const mapActionsToProps = {
  ...actions,
  initDB: createCache,
  connectToDB: connectToCache,
  refreshDB: refreshCache,
};

export const NavigationTree = connect(mapStateToProps, mapActionsToProps)(withTranslation('common')(_NavigationTree));
