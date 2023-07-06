import React, { useEffect, useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { MSTRIcon } from '@mstr/mstr-react-library';
import { PopupButtons } from '../../popup/popup-buttons/popup-buttons';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { EmbeddedLibrary } from './embedded-library';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import './library.css';
import { DEFAULT_PROJECT_NAME } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import { popupHelper } from '../../popup/popup-helper';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { sessionHelper, EXTEND_SESSION } from '../../storage/session-helper';
import { navigationTreeActions } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { popupStateActions } from '../../redux-reducer/popup-state-reducer/popup-state-actions';

const { isPrompted, getCubeInfo } = mstrObjectRestService;

export const LibraryWindowNotConnected = (props) => {
  const [previewDisplay, setPreviewDisplay] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [isEmbeddedLibraryLoaded, setIsEmbeddedLibraryLoaded] = useState(false);

  const [t] = useTranslation();

  const {
    chosenObjectId,
    chosenProjectId,
    selectObject,
    chosenSubtype,
    chosenObjectName,
    requestImport,
    requestDossierOpen,
    handlePrepare,
    setObjectData,
    handleBack,
    mstrObjectType
  } = props;

  const disableActiveActions = !isPublished;

  const handleSelection = async ({
    id: objectId,
    projectId,
    subtype = 779,
    name: objectName,
  }) => {
    const chosenMstrObjectType = mstrObjectEnum.getMstrTypeBySubtype(subtype);

    let isCubePublished = true;

    if (chosenMstrObjectType === mstrObjectEnum.mstrObjectType.dataset) {
      try {
        const cubeInfo = await getCubeInfo(objectId, projectId);
        isCubePublished = cubeInfo.status !== 0 || cubeInfo.serverMode === 2;
      } catch (error) {
        popupHelper.handlePopupErrors(error);
      }
    }

    if (objectId) {
      setIsPublished(isCubePublished);
    }

    selectObject({
      chosenObjectId: objectId,
      chosenObjectName: objectName,
      chosenProjectId: projectId,
      chosenSubtype: subtype,
      mstrObjectType: chosenMstrObjectType,
    });
  };

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

  /**
   * Change state of component so that informative message is showed only after embedded dossier is loaded.
   *
   */
  const handleEmbeddedLibraryLoad = () => {
    setIsEmbeddedLibraryLoaded(true);
  };

  const validateSession = () => {
    authenticationHelper.validateAuthToken().catch((error) => {
      popupHelper.handlePopupErrors(error);
    });
  };

  return (
    <div className="library-window">
      <div className="title_bar">
        <span>{t('Import Data')}</span>
      </div>

      {isEmbeddedLibraryLoaded && (
        <span className="library-window-information-frame">
          <MSTRIcon
            clasName="library-window-information-icon"
            type="info-icon"
          />
          <span className="library-window-information-text">
            {`${t('To import data, select an item.')}`}
          </span>
        </span>
      )}

      <EmbeddedLibrary
        handleSelection={handleSelection}
        handleIframeLoadEvent={validateSession}
        handleEmbeddedLibraryLoad={handleEmbeddedLibraryLoad}
      />
      <PopupButtons
        disableActiveActions={!chosenObjectId || disableActiveActions}
        handleOk={handleOk}
        handleSecondary={handleSecondary}
        handleCancel={handleCancel}
        previewDisplay={previewDisplay}
        disableSecondary={mstrObjectType && mstrObjectType.name === mstrObjectEnum.mstrObjectType.dossier.name}
        isPublished={isPublished}
      />
    </div>
  );
};

LibraryWindowNotConnected.propTypes = {
  chosenSubtype: PropTypes.number,
  selectObject: PropTypes.func,
  chosenObjectId: PropTypes.string,
  chosenObjectName: PropTypes.string,
  chosenProjectId: PropTypes.string,
  handleBack: PropTypes.func,
  editedObject: PropTypes.shape({
    chosenObjectId: PropTypes.string,
    projectId: PropTypes.string,
    isEdit: PropTypes.bool,
    instanceId: PropTypes.string,
    dossierName: PropTypes.string,
    promptsAnswers: PropTypes.array || null,
    selectedViz: PropTypes.string,
  }),
  requestImport: PropTypes.func,
  requestDossierOpen: PropTypes.func,
  handlePrepare: PropTypes.func,
  setObjectData: PropTypes.func,
  mstrObjectType: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.shape({})]),
};

LibraryWindowNotConnected.defaultProps = {
  chosenObjectId: 'default id',
  chosenObjectName: DEFAULT_PROJECT_NAME,
  chosenProjectId: 'default id',
  handleBack: () => {},
  editedObject: {
    chosenObjectId: undefined,
    projectId: undefined,
    isEdit: false,
    instanceId: undefined,
    dossierName: undefined,
    promptsAnswers: null,
    selectedViz: '',
  },
};

function mapStateToProps(state) {
  const {
    navigationTree,
    popupReducer,
    sessionReducer,
    officeReducer
  } = state;
  const {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
    chosenSubtype,
    promptsAnswers
  } = navigationTree;
  const { editedObject } = popupReducer;
  const { supportForms } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const isReport = editedObject && editedObject.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  const editedObjectParse = {
    ...popupHelper.parsePopupState(
      editedObject,
      promptsAnswers,
      formsPrivilege
    ),
  };
  return {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
    chosenSubtype,
    editedObject: editedObjectParse,
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

export const LibraryWindow = connect(mapStateToProps, mapActionsToProps)(LibraryWindowNotConnected);
