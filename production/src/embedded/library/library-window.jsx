import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { PopupButtons } from '../../popup/popup-buttons/popup-buttons';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { EmbeddedLibrary } from './embedded-library';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import './library.css';
import { popupHelper } from '../../popup/popup-helper';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { sessionHelper, EXTEND_SESSION } from '../../storage/session-helper';
import { navigationTreeActions } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { popupStateActions } from '../../redux-reducer/popup-state-reducer/popup-state-actions';

const { isPrompted, getCubeInfo, getObjectInfo } = mstrObjectRestService;

const getMstrObjectEnumByType = (type = 3) => {
  switch (type) {
    case 55:
      return mstrObjectEnum.mstrObjectType.dossier;
    case 3:
    default:
      return mstrObjectEnum.mstrObjectType.report;
  }
};

export const LibraryWindowNotConnected = (props) => {
  const [previewDisplay, setPreviewDisplay] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [t] = useTranslation();

  const {
    chosenObjectId,
    chosenProjectId,
    selectObject,
    chosenSubtype,
    requestImport,
    requestDossierOpen,
    handlePrepare,
    setObjectData,
    mstrObjectType,
  } = props;

  const disableActiveActions = !isPublished;

  /**
   * The callback function which is invoked when the user selects an object from embedded library.
   * The parameter in this function is provided by the ON_LIBRARY_ITEM_SELECTED event. It will be 
   * an array containing only one object which will be the selected dossier or report or dataset
   * @param {*} itemsInfo - Array of selected items
   */
  const handleSelection = async (itemsInfo = []) => {
    if (itemsInfo.length > 0) {
      const {
        projectId,
        type,
        name,
        docId,
      } = itemsInfo[0];

      let { id, subtype } = itemsInfo[0];

      if (!subtype || typeof subtype !== 'number') {
        try {
          const objectInfo = await getObjectInfo(docId, projectId, getMstrObjectEnumByType(type));
          subtype = objectInfo.subtype;
          /**
           * if subtype is not defined then the object is selected from a library page other
           * than content discovery and search page. In this case we set use docId as the id
           */
          id = docId;
        } catch (error) {
          popupHelper.handlePopupErrors(error);
        }
      }

      const chosenMstrObjectType = mstrObjectEnum.getMstrTypeBySubtype(subtype);

      let isCubePublished = true;

      if (chosenMstrObjectType === mstrObjectEnum.mstrObjectType.dataset) {
        try {
          const cubeInfo = await getCubeInfo(id, projectId);
          isCubePublished = cubeInfo.status !== 0 || cubeInfo.serverMode === 2;
        } catch (error) {
          popupHelper.handlePopupErrors(error);
        }
      }

      setIsPublished(isCubePublished);

      selectObject({
        chosenObjectId: id,
        chosenObjectName: name,
        chosenProjectId: projectId,
        chosenSubtype: subtype,
        mstrObjectType: chosenMstrObjectType,
      });
    } else {
      selectObject({
        chosenObjectId: null,
        chosenObjectName: null,
        chosenProjectId: null,
        chosenSubtype: null,
        mstrObjectType: null,
      });
    }
  };

  /**
   * The callback function which is invoked when the user clicks 'Import'
   */
  const handleOk = async () => {
    let isPromptedResponse = false;
    try {
      // If myLibrary is on, then selected object is a dossier.
      const chosenMstrObjectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);
      if (
        chosenMstrObjectType === mstrObjectEnum.mstrObjectType.report
        || chosenMstrObjectType === mstrObjectEnum.mstrObjectType.dossier
      ) {
        isPromptedResponse = await isPrompted(
          chosenObjectId,
          chosenProjectId,
          chosenMstrObjectType.name
        );
      }
      if (
        chosenMstrObjectType.name === mstrObjectEnum.mstrObjectType.dossier.name
      ) {
        requestDossierOpen();
      } else {
        requestImport(isPromptedResponse);
      }
    } catch (e) {
      popupHelper.handlePopupErrors(e);
    }
  };

  /**
   * The callback function which is invoked when the user clicks 'Prepare data'
   */
  const handleSecondary = async () => {
    try {
      const chosenMstrObjectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);

      if (
        chosenMstrObjectType === mstrObjectEnum.mstrObjectType.report
        || chosenMstrObjectType === mstrObjectEnum.mstrObjectType.dossier
      ) {
        const isPromptedResponse = await isPrompted(
          chosenObjectId,
          chosenProjectId,
          chosenMstrObjectType.name
        );
        setObjectData({ isPrompted: isPromptedResponse });
      }
      handlePrepare();
      setPreviewDisplay(true);
    } catch (err) {
      popupHelper.handlePopupErrors(err);
    }
  };

  /**
   * The callback function which is invoked when the user clicks 'Cancel'
   */
  const handleCancel = () => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel };
    popupHelper.officeMessageParent(message);
  };

  const { installSessionProlongingHandler } = sessionHelper;

  const prolongSession = installSessionProlongingHandler(handleCancel);

  const extendSession = useCallback(
    (message = {}) => {
      const { data: postMessage, origin } = message;
      const { origin: targetOrigin } = window;
      if (origin === targetOrigin && postMessage === EXTEND_SESSION) {
        prolongSession();
      }
    },
    [prolongSession]
  );

  useEffect(() => {
    window.addEventListener('message', extendSession);

    return () => window.removeEventListener('message', extendSession);
  }, [extendSession]);

  const validateSession = () => {
    authenticationHelper.validateAuthToken().catch((error) => {
      popupHelper.handlePopupErrors(error);
    });
  };

  return (
    <div className="library-window">
      <div className="title-bar">
        <span>{t('Import Data')}</span>
      </div>
      <EmbeddedLibrary
        handleSelection={handleSelection}
        handleIframeLoadEvent={validateSession}
      />
      <PopupButtons
        disableActiveActions={!chosenObjectId || disableActiveActions}
        handleOk={handleOk}
        handleSecondary={handleSecondary}
        handleCancel={handleCancel}
        previewDisplay={previewDisplay}
        disableSecondary={
          mstrObjectType && mstrObjectType.name === mstrObjectEnum.mstrObjectType.dossier.name
        }
        isPublished={isPublished}
      />
    </div>
  );
};

LibraryWindowNotConnected.propTypes = {
  chosenSubtype: PropTypes.number,
  selectObject: PropTypes.func,
  chosenObjectId: PropTypes.string,
  chosenProjectId: PropTypes.string,
  requestImport: PropTypes.func,
  requestDossierOpen: PropTypes.func,
  handlePrepare: PropTypes.func,
  setObjectData: PropTypes.func,
  mstrObjectType: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.shape({}),
  ]),
};

function mapStateToProps(state) {
  const { navigationTree } = state;
  const {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
    chosenSubtype,
    mstrObjectType
  } = navigationTree;
  return {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
    chosenSubtype,
    mstrObjectType,
    ...navigationTreeActions,
  };
}

const mapActionsToProps = {
  selectObject: navigationTreeActions.selectObject,
  requestDossierOpen: navigationTreeActions.requestDossierOpen,
  requestImport: navigationTreeActions.requestImport,
  handlePrepare: popupStateActions.onPrepareData,
  setObjectData: popupStateActions.setObjectData,
};

export const LibraryWindow = connect(
  mapStateToProps,
  mapActionsToProps
)(LibraryWindowNotConnected);
