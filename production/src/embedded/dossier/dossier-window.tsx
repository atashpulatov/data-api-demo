import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ObjectWindowTitle, Popup } from '@mstr/connector-components';
// @ts-expect-error
import { MSTRIcon } from '@mstr/mstr-react-library';
import { Spinner } from '@mstr/rc';

import { authenticationHelper } from '../../authentication/authentication-helper';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import overviewHelper from '../../popup/overview/overview-helper';
import { popupHelper } from '../../popup/popup-helper';
import { EXTEND_SESSION, sessionHelper } from '../../storage/session-helper';

import { RootState } from '../../store';

import { EditedObject } from '../../redux-reducer/popup-reducer/popup-reducer-types';
import { RepromptsQueueState } from '../../redux-reducer/reprompt-queue-reducer/reprompt-queue-reducer-types';

import { selectorProperties } from '../../attribute-selector/selector-properties';
import i18n from '../../i18n';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { PopupButtons } from '../../popup/popup-buttons/popup-buttons';
import { DEFAULT_PROJECT_NAME } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import { popupStateActions } from '../../redux-reducer/popup-state-reducer/popup-state-actions';
import { EmbeddedDossier } from './embedded-dossier';
import { errorCodes } from '../../error/constants';
import { ObjectImportType } from '../../mstr-object/constants';

import './dossier.css';

interface DossierWindowProps {
  chosenObjectId: string;
  chosenObjectName: string;
  chosenProjectId: string;
  isShapeAPISupported: boolean;
  handleBack: () => void;
  setImportType: (importType: ObjectImportType) => void;
  editedObject: EditedObject;
  isReprompt: boolean;
  importType: ObjectImportType;
  repromptsQueue: RepromptsQueueState;
  popupData: { objectWorkingId: number };
}

export const DossierWindowNotConnected: React.FC<DossierWindowProps> = props => {
  const [t] = useTranslation('common', { i18n });
  const [promptsAnswers, setPromptsAnswers] = useState([]);
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
    editedObject = {} as EditedObject,
    chosenObjectId = 'default id',
    chosenProjectId = 'default id',
    isReprompt = false,
    importType = ObjectImportType.TABLE,
    repromptsQueue = { total: 0, index: 0 },
    isShapeAPISupported = false,
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
  const isSecondaryActionDisabled = !isShapeAPISupported || isEdit;

  const handleCancel = (): void => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel };
    popupHelper.officeMessageParent(message);
  };

  const { installSessionProlongingHandler } = sessionHelper;

  const prolongSession = installSessionProlongingHandler(handleCancel);

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
        promptsAnswers: chosenVizPromptAnswers,
        instanceId: chosenVizInstanceId,
      } = dossierData;

      if (chosenVizInstanceId) {
        setLastSelectedViz({
          chapterKey: chosenVizchapterKey,
          visualizationKey: chosenVizKey,
          vizDimensions: chosenVizDimensions,
        });
        setPromptsAnswers(chosenVizPromptAnswers);
        instanceId.current = chosenVizInstanceId;

        if (
          !vizualizationsData.find(
            el => el.visualizationKey === chosenVizKey && el.chapterKey === chosenVizchapterKey
          )
        ) {
          let isVizSupported = true;

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
              popupHelper.handlePopupErrors(error);
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
    [chosenObjectId, chosenProjectId, vizualizationsData]
  );

  const handleOk = useCallback(
    (impType = ObjectImportType.TABLE) => {
      const message = {
        command: selectorProperties.commandOk,
        chosenObjectName,
        chosenObject: chosenObjectId,
        chosenProject: chosenProjectId,
        chosenSubtype: mstrObjectEnum.mstrObjectType.visualization.subtypes,
        // @ts-expect-error
        isPrompted: promptsAnswers?.answers?.length > 0,
        promptsAnswers,
        importType: impType,
        visualizationInfo: {
          chapterKey,
          visualizationKey,
          vizDimensions,
        },
        preparedInstanceId: instanceId.current,
        isEdit,
      };
      popupHelper.officeMessageParent(message);
    },
    [
      chapterKey,
      chosenObjectId,
      chosenObjectName,
      chosenProjectId,
      instanceId,
      isEdit,
      promptsAnswers,
      visualizationKey,
      vizDimensions,
    ]
  );

  // Automatically close popup if re-prompted dossier is answered
  // and visualization is selected
  useEffect(() => {
    if (isReprompt && isSelected) {
      handleOk(importType);

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
   * Change state of component so that informative message is showed only after embedded dossier is loaded.
   *
   */
  const handleEmbeddedDossierLoad = useCallback(() => {
    setIsEmbeddedDossierLoaded(true);
  }, []);

  const validateSession = useCallback(() => {
    authenticationHelper.validateAuthToken().catch(error => {
      popupHelper.handlePopupErrors(error);
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
              handleInstanceIdChange={handleInstanceIdChange}
              handleIframeLoadEvent={validateSession}
              handleEmbeddedDossierLoad={handleEmbeddedDossierLoad}
              handleEmbeddedDossierVisibility={handleEmbeddedDossierVisibility}
            />
          </div>
          <PopupButtons
            handleOk={() => handleOk(importType)}
            handleSecondary={() => handleOk(ObjectImportType.IMAGE)}
            hideSecondary={isSecondaryActionDisabled}
            shouldShowImportAsVisualization
            handleCancel={handleCancel}
            handleBack={!isEdit && handleBack}
            disableActiveActions={!isSelected}
            isPublished={!(isSelected && !isSupported && !isChecking)}
            isEdit={isEdit}
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
    repromptsQueueReducer,
  } = state;
  const {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
    promptsAnswers,
    promptObjects,
    importRequested,
  } = navigationTree;
  const { editedObject } = popupReducer;
  const { isReprompt, importType } = popupStateReducer;
  const { supportForms, isShapeAPISupported, popupData } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const { answers } = answersReducer;
  const isReport =
    editedObject && editedObject.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  const editedObjectParse = {
    ...popupHelper.parsePopupState(editedObject, promptsAnswers, formsPrivilege),
  };
  editedObjectParse.importType = editedObject?.importType;
  return {
    chosenObjectName: editedObject ? editedObjectParse.dossierName : chosenObjectName,
    chosenObjectId: editedObject ? editedObjectParse.chosenObjectId : chosenObjectId,
    chosenProjectId: editedObject ? editedObjectParse.projectId : chosenProjectId,
    editedObject: editedObjectParse,
    previousPromptsAnswers: answers,
    promptObjects,
    importRequested,
    isShapeAPISupported,
    isReprompt,
    importType,
    repromptsQueue: { ...repromptsQueueReducer },
    popupData,
  };
}

const mapActionsToProps = {
  handleBack: popupStateActions.onPopupBack,
  setImportType: popupStateActions.setImportType,
};

export const DossierWindow = connect(mapStateToProps, mapActionsToProps)(DossierWindowNotConnected);
