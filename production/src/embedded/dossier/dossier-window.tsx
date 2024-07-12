import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ObjectWindowTitle, Popup } from '@mstr/connector-components';
// @ts-expect-error
import { MSTRIcon } from '@mstr/mstr-react-library';
import { Spinner } from '@mstr/rc';

import { authenticationHelper } from '../../authentication/authentication-helper';
import { dialogHelper } from '../../dialog/dialog-helper';
import overviewHelper from '../../dialog/overview/overview-helper';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { EXTEND_SESSION, sessionHelper } from '../../storage/session-helper';

import { RootState } from '../../store';

import { DialogCommands } from '../../dialog/dialog-controller-types';
import { EditedObject } from '../../redux-reducer/popup-reducer/popup-reducer-types';
import { RepromptsQueueState } from '../../redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer-types';

import { DialogButtons } from '../../dialog/dialog-buttons/dialog-buttons';
import i18n from '../../i18n';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { navigationTreeActions } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { DEFAULT_PROJECT_NAME } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import { popupStateActions } from '../../redux-reducer/popup-state-reducer/popup-state-actions';
import { EmbeddedDossier } from './embedded-dossier';
import { errorCodes } from '../../error/constants';
import { ObjectImportType } from '../../mstr-object/constants';

import './dossier.scss';

interface DossierWindowProps {
  chosenObjectId: string;
  chosenObjectName: string;
  chosenProjectId: string;
  isChosenVisOfGridType: boolean;
  isShapeAPISupported: boolean;
  handleBack: () => void;
  setImportType: (importType: ObjectImportType) => void;
  updateIsChosenVizOfGridType: (isVizGrid: boolean) => void;
  editedObject: EditedObject;
  isReprompt: boolean;
  importType: ObjectImportType;
  defaultImportType: ObjectImportType;
  repromptsQueue: RepromptsQueueState;
  popupData: { objectWorkingId: number };
}

export const DossierWindowNotConnected: React.FC<DossierWindowProps> = props => {
  const [t] = useTranslation('common', { i18n });
  const [promptsAnswers, setPromptsAnswers] = useState([]);
  const [promptKeys, setPromptKeys] = useState<string[]>([]);
  const instanceId = useRef('');
  const [vizualizationsData, setVizualizationsData] = useState([]);
  const [lastSelectedViz, setLastSelectedViz] = useState<any>({});
  const [isEmbeddedDossierLoaded, setIsEmbeddedDossierLoaded] = useState(false);
  const previousSelectionBackup = useRef([]);

  // New showLoading variable is needed to let the loading spinner show while prompted dossier is answered
  // behind the scenes which could take some time; especially if there are nested prompts.
  // NOTE: This loading spinner is separate from the one in EmbeddedDossier component.
  const [showLoading, setShowLoading] = useState(false);
  const [visibleEmbeddedDossier, setVisibleEmbeddedDossier] = useState(true);

  // TODO check if default values are needed
  const {
    chosenObjectName = DEFAULT_PROJECT_NAME,
    handleBack,
    setImportType,
    updateIsChosenVizOfGridType,
    editedObject = {} as EditedObject,
    chosenObjectId = 'default id',
    chosenProjectId = 'default id',
    isChosenVisOfGridType,
    isReprompt = false,
    importType,
    defaultImportType,
    repromptsQueue = { total: 0, index: 0 },
    popupData,
  } = props;

  const { isEdit, importType: editedObjectImportType } = editedObject;
  const { chapterKey, visualizationKey, vizDimensions } = lastSelectedViz;
  const [dialogPopup, setDialogPopup] = React.useState(null);

  if (editedObjectImportType && importType !== editedObjectImportType) {
    setImportType(editedObjectImportType);
  }

  const vizData = useMemo(
    () =>
      vizualizationsData.find(
        el => el.visualizationKey === visualizationKey && el.chapterKey === chapterKey
      ),
    [chapterKey, visualizationKey, vizualizationsData]
  );

  const isSelected = !!(chapterKey && visualizationKey);
  const isSupported = !!(isSelected && vizData && vizData.isSupported);
  const isChecking = !!(isSelected && (!vizData || (vizData && vizData.isSupported === undefined)));
  const isVizOfNonGridTypeOnFormattedDataImport =
    importType === ObjectImportType.FORMATTED_DATA && !isChosenVisOfGridType;

  const handleCancel = (): void => {
    const message = { command: DialogCommands.COMMAND_CANCEL };
    dialogHelper.officeMessageParent(message);
  };

  const prolongSession = sessionHelper.installSessionProlongingHandler(handleCancel);

  const extendSession = useCallback(
    (message: any = {}) => {
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

  useEffect(() => {
    if (popupData) {
      overviewHelper.setRangeTakenPopup({
        objectWorkingIds: [popupData.objectWorkingId],
        setDialogPopup,
      });
    } else {
      setDialogPopup(null);
    }
  }, [popupData]);

  const handleSelection = useCallback(
    async (dossierData: any) => {
      const {
        chapterKey: chosenVizchapterKey,
        visualizationKey: chosenVizKey,
        vizDimensions: chosenVizDimensions,
        isVizGrid: chosenVizIsGrid,
        promptsAnswers: chosenVizPromptAnswers,
        instanceId: chosenVizInstanceId,
      } = dossierData;

      if (chosenVizInstanceId) {
        setLastSelectedViz({
          chapterKey: chosenVizchapterKey,
          visualizationKey: chosenVizKey,
          vizDimensions: chosenVizDimensions,
        });

        if (chosenVizIsGrid !== undefined && chosenVizIsGrid !== null) {
          updateIsChosenVizOfGridType(chosenVizIsGrid);
        }

        setPromptsAnswers(chosenVizPromptAnswers);
        instanceId.current = chosenVizInstanceId;

        if (
          !vizualizationsData.find(
            el => el.visualizationKey === chosenVizKey && el.chapterKey === chosenVizchapterKey
          )
        ) {
          let isVizSupported = true;

          setImportType(defaultImportType);

          const checkIfVizDataCanBeImported = async (): Promise<any> => {
            // @ts-expect-error
            await mstrObjectRestService.fetchVisualizationDefinition({
              projectId: chosenProjectId,
              objectId: chosenObjectId,
              instanceId: chosenVizInstanceId,
              visualizationInfo: {
                chapterKey: chosenVizchapterKey,
                visualizationKey: chosenVizKey,
              },
            });
          };

          await Promise.all([
            checkIfVizDataCanBeImported(),
            // For future: add different checks if needed - e.g. visualization not included in dossier instance definition
          ]).catch(error => {
            console.error(error);
            const { ERR009 } = errorCodes;
            if (error.response && error.response.body.code === ERR009) {
              // Close popup if session expired
              dialogHelper.handlePopupErrors(error);
            } else {
              isVizSupported = false;
            }
          });

          setVizualizationsData([
            ...vizualizationsData,
            {
              chapterKey: chosenVizchapterKey,
              visualizationKey: chosenVizKey,
              isSupported: isVizSupported,
            },
          ]);
        }
      }
    },
    [
      chosenObjectId,
      chosenProjectId,
      vizualizationsData,
      defaultImportType,
      setImportType,
      updateIsChosenVizOfGridType,
    ]
  );

  const handleOk = useCallback(() => {
    const message = {
      command: DialogCommands.COMMAND_OK,
      objectsDialogInfo: [
        {
          chosenObjectName,
          chosenObject: chosenObjectId,
          chosenProject: chosenProjectId,
          chosenSubtype: mstrObjectEnum.mstrObjectType.visualization.subtypes,
          isPrompted: promptsAnswers?.length > 0,
          promptsAnswers,
          promptKeys,
          importType,
          visualizationInfo: {
            chapterKey,
            visualizationKey,
            vizDimensions,
          },
          preparedInstanceId: instanceId.current,
          isEdit,
        },
      ],
    };
    dialogHelper.officeMessageParent(message);
  }, [
    chapterKey,
    chosenObjectId,
    chosenObjectName,
    chosenProjectId,
    instanceId,
    isEdit,
    promptsAnswers,
    promptKeys,
    visualizationKey,
    vizDimensions,
    importType,
  ]);

  // Automatically close popup if re-prompted dossier is answered
  // and visualization is selected
  useEffect(() => {
    if (isReprompt && isSelected) {
      handleOk();

      // Hide embedded and let loading spinner show while prompts are being answered.
      setShowLoading(true);
    }
  }, [isReprompt, isSelected, importType, handleOk]);

  /**
   * Store new instance id in state.
   * Unselect visualization after instanceId changed.
   * Restore backuped viz selection info in case of return to previous instance.
   * Above happens on reprompt button click followed by cancel button click in reprompt popup.
   *
   * @param {String} newInstanceId
   */
  const handleInstanceIdChange = useCallback(
    (newInstanceId: string) => {
      const backup = previousSelectionBackup.current.find(el => el.instanceId === newInstanceId);

      if (instanceId.current !== newInstanceId && !backup) {
        const currentInstanceId = instanceId.current;
        // Make a backup of last selection info.
        previousSelectionBackup.current = [
          { currentInstanceId, lastSelectedViz },
          ...previousSelectionBackup.current,
        ];
        // Clear selection of viz and update instance id.
        instanceId.current = newInstanceId;
        lastSelectedViz && Object.keys(lastSelectedViz).length > 0 && setLastSelectedViz([]);
        vizualizationsData?.length > 0 && setVizualizationsData([]);
      } else {
        // Restore backuped viz selection info in case of return to prev instance
        vizualizationsData?.length > 0 && setVizualizationsData([]);
        handleSelection({
          ...backup.lastSelectedViz,
          promptsAnswers,
          instanceId: backup.instanceId,
        });
      }
    },
    [handleSelection, lastSelectedViz, promptsAnswers, vizualizationsData]
  );

  /**
   * Store new prompts answers in state
   *
   * @param {Array} newAnswers
   */
  const handlePromptAnswer = useCallback(
    (newAnswers: any) => {
      setPromptsAnswers(newAnswers);
      vizualizationsData?.length > 0 && setVizualizationsData([]);
    },
    [vizualizationsData]
  );

  /**
   * Updates the state of unique prompt keys with the provided array of prompt keys in that execution of multiple reprompt.
   * This function is used to handle and update the prompt keys.
   *
   * @param newPromptKeys - An array of new prompt keys to update the state with.
   */
  const handleUniquePromptKeys = (newPromptKeys: string[]): void => {
    setPromptKeys(newPromptKeys);
  };

  /**
   * Change state of component so that informative message is showed only after embedded dossier is loaded.
   *
   */
  const handleEmbeddedDossierLoad = useCallback(() => {
    setIsEmbeddedDossierLoaded(true);
  }, []);

  const validateSession = useCallback(() => {
    authenticationHelper.validateAuthToken().catch(error => {
      dialogHelper.handlePopupErrors(error);
    });
  }, []);

  /**
   * Change state of the visibility of only the embedded dossier without affecting the rest of the component.
   * This is used to hide the embedded dossier when prompts are being answered and trying to avoid any flickering
   * when the consumption mode is loaded.
   *
   * @param {Boolean} enableVisibility true to show the embedded dossier, false to hide it
   */
  const handleEmbeddedDossierVisibility = useCallback((enableVisibility: boolean) => {
    setVisibleEmbeddedDossier(enableVisibility);
  }, []);

  return (
    <div className='dossier-window'>
      {isEmbeddedDossierLoaded && (
        <span className='dossier-window-information-frame'>
          <MSTRIcon clasName='dossier-window-information-icon' type='info-icon' />
          <span className='dossier-window-information-text'>
            {`${t(
              'This view supports the regular dossier manipulations. To import data, select a visualization.'
            )}`}
          </span>
        </span>
      )}
      <ObjectWindowTitle
        objectType={mstrObjectEnum.mstrObjectType.dossier.name}
        objectName={chosenObjectName}
        isReprompt={isReprompt}
        isEdit={isEdit && !isReprompt}
        index={repromptsQueue.index}
        total={repromptsQueue.total}
      />
      <Spinner className='loading-spinner' type='large'>
        {t('Loading...')}
      </Spinner>
      {!showLoading && ( // Hide embedded dossier only after prompts are answered.
        <>
          <div
            className={`${visibleEmbeddedDossier ? 'dossier-window-embedded' : 'dossier-window-embedded-empty'}`}
          >
            <EmbeddedDossier
              // @ts-expect-error
              handleSelection={handleSelection}
              handlePromptAnswer={handlePromptAnswer}
              handleUniquePromptKeys={handleUniquePromptKeys}
              handleInstanceIdChange={handleInstanceIdChange}
              handleIframeLoadEvent={validateSession}
              handleEmbeddedDossierLoad={handleEmbeddedDossierLoad}
              handleEmbeddedDossierVisibility={handleEmbeddedDossierVisibility}
            />
          </div>
          <DialogButtons
            handleOk={handleOk}
            handleCancel={handleCancel}
            handleBack={!isEdit && handleBack}
            hideSecondary
            disableActiveActions={!isSelected}
            disablePrimaryOnFormattedDataImport={isVizOfNonGridTypeOnFormattedDataImport}
            isPublished={!(isSelected && !isSupported && !isChecking)}
            disableSecondary={isSelected && !isSupported && !isChecking}
            checkingSelection={isChecking}
            hideOk={isReprompt}
          />
        </>
      )}
      {!!dialogPopup && (
        <div className='standalone-popup'>
          <Popup {...dialogPopup} />
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state: RootState): any {
  const {
    navigationTree,
    popupReducer,
    sessionReducer,
    officeReducer,
    answersReducer,
    popupStateReducer,
    settingsReducer,
    repromptsQueueReducer,
  } = state;
  const {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
    isChosenVisOfGridType,
    promptsAnswers,
    promptObjects,
    importRequested,
  } = navigationTree;
  const { editedObject } = popupReducer;
  const { isReprompt, importType } = popupStateReducer;
  const { importType: defaultImportType } = settingsReducer;
  const { supportForms, isShapeAPISupported, popupData } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const { answers } = answersReducer;
  const isReport =
    editedObject && editedObject.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  const editedObjectParse = {
    ...dialogHelper.parsePopupState(editedObject, promptsAnswers, formsPrivilege),
  };
  editedObjectParse.importType = editedObject?.importType;
  return {
    chosenObjectName: editedObject ? editedObjectParse.dossierName : chosenObjectName,
    chosenObjectId: editedObject ? editedObjectParse.chosenObjectId : chosenObjectId,
    chosenProjectId: editedObject ? editedObjectParse.projectId : chosenProjectId,
    isChosenVisOfGridType,
    editedObject: editedObjectParse,
    previousPromptsAnswers: answers,
    promptObjects,
    importRequested,
    isShapeAPISupported,
    isReprompt,
    importType,
    defaultImportType,
    repromptsQueue: { ...repromptsQueueReducer },
    popupData,
  };
}

const mapActionsToProps = {
  handleBack: popupStateActions.onPopupBack,
  setImportType: popupStateActions.setImportType,
  updateIsChosenVizOfGridType: navigationTreeActions.updateIsChosenVizOfGridType,
};

export const DossierWindow = connect(mapStateToProps, mapActionsToProps)(DossierWindowNotConnected);
