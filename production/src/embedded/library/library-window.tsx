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
import { ItemType, LibraryWindowProps } from './library-window-types';
import { TARGET_PAGE_KEYS, TARGET_GROUP_KEYS } from './embedded-library-constants';

const { isPrompted, getCubeInfo, getObjectInfo } = mstrObjectRestService;

export const LibraryWindowNotConnected = (props: LibraryWindowProps) => {
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
    updateSelectedMenu,
  } = props;

  const disableActiveActions = !isPublished;

  /**
   * Selects an object from embedded library and saves its info in the redux store.
   * The parameter in this function is provided by the ON_LIBRARY_ITEM_SELECTED event. It will be
   * an array containing only one object which will be the selected dossier or report or dataset
   *
   * @param {{Array<ItemType>}} itemsInfo - Array of selected items
   */
  const handleSelection = async (itemsInfo: ItemType[]): Promise<any> => {
    if (!itemsInfo || itemsInfo.length === 0) {
      selectObject({});
      return;
    }

    const {
      projectId,
      type,
      name,
      docId,
    } = itemsInfo[0];

    let { id, subtype } = itemsInfo[0];

    if (!subtype || typeof subtype !== 'number') {
      try {
        const objectType = type === 55 ? mstrObjectEnum.mstrObjectType.dossier : mstrObjectEnum.mstrObjectType.report;
        const objectInfo = await getObjectInfo(docId, projectId, objectType);
        subtype = objectInfo.subtype;
        // if subtype is not defined then the object is selected from a library page other
        // than content discovery and search page. In this case we set use docId as the id
        id = docId;
      } catch (error) {
        popupHelper.handlePopupErrors(error);
      }
    }

    const chosenMstrObjectType = mstrObjectEnum.getMstrTypeBySubtype(subtype);

    let isCubePublished = true;

    if (chosenMstrObjectType === mstrObjectEnum.mstrObjectType.dataset) {
      try {
        const cubeInfo: any = await getCubeInfo(id, projectId);
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
  };

  /**
   * Selects the selected menu from embedded library and saves it in the redux store.
   * The parameter in this function is provided by the ON_LIBRARY_MENU_SELECTED event. 
   *
   * @param {Object} selectedMenu - Selected menu object 
   * conataining pageKey {@link TARGET_PAGE_KEYS} and groupType {@link TARGET_GROUP_KEYS}
   */
  const handleMenuSelection = (selectedMenu: { pageKey: string, groupType:string }) => {
    let targetPage = null;
    if (!selectedMenu?.groupType && selectedMenu?.pageKey in TARGET_PAGE_KEYS) {
      targetPage = {
        pageKey: selectedMenu.pageKey,
        groupId: null,
      };
    } else if (selectedMenu?.groupType && selectedMenu?.groupType in TARGET_GROUP_KEYS) {
      targetPage = {
        pageKey: selectedMenu.groupType,
        groupId: selectedMenu.pageKey,
      };
    }

    updateSelectedMenu(targetPage);
  };

  /**
   * Imports the object selected by the user
   */
  const handleOk = async () => {
    let isPromptedResponse = false;
    try {
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
   * Checks if the selected object is prompted and invokes popup
   * to render the 'Prepare data' UI
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
    } catch (err) {
      popupHelper.handlePopupErrors(err);
    }
  };

  /**
   * sends a command to cancel the object selection and closes the popup
   */
  const handleCancel = () => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel };
    popupHelper.officeMessageParent(message);
  };

  const { installSessionProlongingHandler } = sessionHelper;

  const prolongSession = installSessionProlongingHandler(handleCancel);

  const extendSession = useCallback(
    (message: any) => {
      const { data: postMessage, origin } = message || {};
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
    authenticationHelper.validateAuthToken().catch((error: object) => {
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
        handleMenuSelection={handleMenuSelection}
        handleIframeLoadEvent={validateSession}
      />
      <PopupButtons
        disableActiveActions={!chosenObjectId || disableActiveActions}
        handleOk={handleOk}
        handleSecondary={handleSecondary}
        handleCancel={handleCancel}
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
  updateSelectedMenu: PropTypes.func,
};

function mapStateToProps(state: {
  navigationTree: {
    chosenObjectName: string;
    chosenObjectId: string;
    chosenProjectId: string;
    chosenSubtype: number;
    mstrObjectType: object;
}}) {
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
  updateSelectedMenu: navigationTreeActions.updateSelectedMenu,
};

export const LibraryWindow = connect(
  mapStateToProps,
  mapActionsToProps
)(LibraryWindowNotConnected);
