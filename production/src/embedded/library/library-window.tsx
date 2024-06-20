import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useDispatch } from 'react-redux';
import { ObjectWindowTitle } from '@mstr/connector-components';
import { Spinner } from '@mstr/rc';

import useGetImportOptions from '../../dialog/dialog-buttons/dialog-import-button/use-get-import-options';
import useGetImportType from '../../dialog/dialog-buttons/dialog-import-button/use-get-import-type';

import { authenticationHelper } from '../../authentication/authentication-helper';
import { dialogHelper } from '../../dialog/dialog-helper';
import { dialogViewSelectorHelper } from '../../dialog/dialog-view-selector-helper';
import { ObjectExecutionStatus } from '../../helpers/prompts-handling-helper';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { pageByHelper } from '../../page-by/page-by-helper';
import { EXTEND_SESSION, sessionHelper } from '../../storage/session-helper';

import { ItemType, LibraryWindowProps } from './library-window-types';

import { selectorProperties } from '../../attribute-selector/selector-properties';
import { DialogButtons } from '../../dialog/dialog-buttons/dialog-buttons';
import i18n from '../../i18n';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { navigationTreeActions } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { popupStateActions } from '../../redux-reducer/popup-state-reducer/popup-state-actions';
import { EmbeddedLibrary } from './embedded-library';
import { DisplayAttrFormNames, ObjectImportType } from '../../mstr-object/constants';

import './library.scss';

const {
  isPrompted,
  getCubeInfo,
  getObjectInfo,
  createDossierInstance,
  deleteDossierInstance,
  getObjectPrompts,
} = mstrObjectRestService;

export const LibraryWindowNotConnected: React.FC<LibraryWindowProps> = props => {
  const dispatch = useDispatch();
  const [isPublished, setIsPublished] = useState(true);
  const [t] = useTranslation('common', { i18n });

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
    requestPageByModalOpen,
  } = props;

  const disableActiveActions = !isPublished;

  const options = useGetImportOptions();
  const importType = useGetImportType(options);

  /**
   * Selects an object from embedded library and saves its info in the redux store.
   * The parameter in this function is provided by the ON_LIBRARY_ITEM_SELECTED event. It will be
   * an array containing only one object which will be the selected dossier or report or dataset
   *
   * @param itemsInfo - Array of selected items
   */
  const handleSelection = useCallback(
    async (itemsInfo: ItemType[]): Promise<any> => {
      if (!itemsInfo || itemsInfo.length === 0) {
        selectObject({});
        return;
      }

      // Reset import type to default on object selection
      dispatch(popupStateActions.setImportType(importType) as any);

      const { projectId, type, name, docId } = itemsInfo[0];

      let { id, subtype } = itemsInfo[0];

      if (!subtype || typeof subtype !== 'number') {
        try {
          const objectType =
            type === 55
              ? mstrObjectEnum.mstrObjectType.dossier
              : mstrObjectEnum.mstrObjectType.report;
          const objectInfo = await getObjectInfo(docId, projectId, objectType);
          subtype = objectInfo.subtype;
          // if subtype is not defined then the object is selected from a library page other
          // than content discovery and search page. In this case we set use docId as the id
          id = docId;
        } catch (error) {
          dialogHelper.handlePopupErrors(error);
        }
      }

      const chosenMstrObjectType = mstrObjectEnum.getMstrTypeBySubtype(subtype);

      let isCubePublished = true;

      if (chosenMstrObjectType === mstrObjectEnum.mstrObjectType.dataset) {
        try {
          const cubeInfo: any = await getCubeInfo(id, projectId);
          isCubePublished = cubeInfo.status !== 0 || cubeInfo.serverMode === 2;
        } catch (error) {
          dialogHelper.handlePopupErrors(error);
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
    },
    [dispatch, selectObject, importType]
  );

  /**
   * Imports the object selected by the user
   */
  const handleOk = async (): Promise<void> => {
    let promptedResponse = {};

    try {
      const chosenMstrObjectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);
      if (chosenMstrObjectType === mstrObjectEnum.mstrObjectType.report) {
        promptedResponse = await isPrompted(
          chosenObjectId,
          chosenProjectId,
          chosenMstrObjectType.name
        );

        const instance = await mstrObjectRestService.createInstance({
          objectId: chosenObjectId,
          projectId: chosenProjectId,
          displayAttrFormNames: DisplayAttrFormNames.AUTOMATIC,
        });

        const { pageBy } = instance.definition?.grid || {};

        const shouldOpenPageByModal = pageByHelper.getShouldOpenPageByModal(pageBy, importType);

        if (shouldOpenPageByModal) {
          await dialogViewSelectorHelper.handleRequestPageByModalOpen({
            objectId: chosenObjectId,
            projectId: chosenProjectId,
            instanceId: instance.instanceId,
            requestPageByModalOpen,
            importCallback: pageByConfigurations =>
              dialogViewSelectorHelper.proceedToImport({ ...props, pageByConfigurations }),
          });
        }
      } else if (chosenMstrObjectType === mstrObjectEnum.mstrObjectType.dossier) {
        // Creating instance without shortcut information to pull prompts definition.
        const instance = await createDossierInstance(chosenProjectId, chosenObjectId, {});

        // If instance is prompted, then pull prompts definition.
        const prompts =
          instance.status !== ObjectExecutionStatus.PROMPTED
            ? []
            : await getObjectPrompts(chosenObjectId, chosenProjectId, instance.mid, null);

        // Updated state with prompts definition, if any.
        promptedResponse = {
          promptObjects: prompts,
          isPrompted: prompts?.length > 0,
        };

        // Delete instance that was created.
        await deleteDossierInstance(chosenProjectId, chosenObjectId, instance.mid);
      }
      if (chosenMstrObjectType.name === mstrObjectEnum.mstrObjectType.dossier.name) {
        requestDossierOpen(promptedResponse);
      } else {
        requestImport(promptedResponse);
      }
    } catch (e) {
      dialogHelper.handlePopupErrors(e);
    }
  };

  /**
   * Checks if the selected object is prompted and invokes popup
   * to render the 'Prepare data' UI
   */
  const handleSecondary = async (): Promise<void> => {
    try {
      const chosenMstrObjectType = mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype);

      if (
        chosenMstrObjectType === mstrObjectEnum.mstrObjectType.report ||
        chosenMstrObjectType === mstrObjectEnum.mstrObjectType.dossier
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
      dialogHelper.handlePopupErrors(err);
    }
  };

  /**
   * sends a command to cancel the object selection and closes the popup
   */
  const handleCancel = useCallback(() => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel };
    dialogHelper.officeMessageParent(message);
  }, []);

  const prolongSession = sessionHelper.installSessionProlongingHandler(handleCancel);

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

  const validateSession = (): void => {
    authenticationHelper.validateAuthToken().catch((error: object) => {
      dialogHelper.handlePopupErrors(error);
    });
  };

  return (
    <div className='library-window'>
      <ObjectWindowTitle
        objectType='' // not needed for import, falls back to 'Data'
        objectName='' // not needed for import
        isReprompt={false}
        isEdit={false}
        index={0}
        total={0}
      />
      <Spinner className='loading-spinner' type='large'>
        {t('Loading...')}
      </Spinner>
      {/* @ts-expect-error fix types after removing connect HOC */}
      <EmbeddedLibrary handleSelection={handleSelection} handleIframeLoadEvent={validateSession} />
      <DialogButtons
        disableActiveActions={!chosenObjectId || disableActiveActions}
        handleOk={handleOk}
        handleSecondary={handleSecondary}
        handleCancel={handleCancel}
        disableSecondary={
          !!mstrObjectType && mstrObjectType.name === mstrObjectEnum.mstrObjectType.dossier.name
        }
        isPublished={isPublished}
        isImportReport={
          mstrObjectEnum.getMstrTypeBySubtype(chosenSubtype)?.type ===
          mstrObjectEnum.mstrObjectType.report.type
        } // Includes entire type 3 objects(reports and cubes)
      />
    </div>
  );
};

function mapStateToProps(state: {
  navigationTree: {
    chosenObjectName: string;
    chosenObjectId: string;
    chosenProjectId: string;
    chosenSubtype: number;
    mstrObjectType: object;
  };
  popupStateReducer: {
    importType: ObjectImportType;
  };
}): any {
  const { navigationTree, popupStateReducer } = state;
  const { chosenObjectName, chosenObjectId, chosenProjectId, chosenSubtype, mstrObjectType } =
    navigationTree;

  const { importType } = popupStateReducer;

  return {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
    chosenSubtype,
    mstrObjectType,
    importType,
    ...navigationTreeActions,
  };
}

const mapActionsToProps = {
  selectObject: navigationTreeActions.selectObject,
  requestDossierOpen: navigationTreeActions.requestDossierOpen,
  requestImport: navigationTreeActions.requestImport,
  requestPageByModalOpen: navigationTreeActions.requestPageByModalOpen,
  handlePrepare: popupStateActions.onPrepareData,
  setObjectData: popupStateActions.setObjectData,
};

export const LibraryWindow = connect(mapStateToProps, mapActionsToProps)(LibraryWindowNotConnected);
