import React, {
  useEffect, useCallback, useState, useMemo, useRef
} from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { MSTRIcon } from '@mstr/mstr-react-library';
import { Empty, ObjectWindowTitle } from '@mstr/connector-components';
import i18n from '../../i18n';
import { PopupButtons } from '../../popup/popup-buttons/popup-buttons';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { EmbeddedDossier } from './embedded-dossier';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import './dossier.css';
import { DEFAULT_PROJECT_NAME } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer';
import { popupHelper } from '../../popup/popup-helper';
import { popupStateActions } from '../../redux-reducer/popup-state-reducer/popup-state-actions';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { sessionHelper, EXTEND_SESSION } from '../../storage/session-helper';
import { errorCodes } from '../../error/constants';
import { objectImportType } from '../../mstr-object/constants';

export const DossierWindowNotConnected = (props) => {
  const [t] = useTranslation('common', { i18n });
  const [promptsAnswers, setPromptsAnswers] = useState([]);
  const instanceId = useRef('');
  const [vizualizationsData, setVizualizationsData] = useState([]);
  const [lastSelectedViz, setLastSelectedViz] = useState({});
  const [isEmbeddedDossierLoaded, setIsEmbeddedDossierLoaded] = useState(false);
  const previousSelectionBackup = useRef([]);

  // New hideEmbedded variable is needed to let the loading spinner show while prompted dossier is answered
  // behind the scenes which could take some time; especially if there are nested prompts.
  // NOTE: This loading spinner is separate from the one in EmbeddedDossier component.
  const [hideEmbedded, setHideEmbedded] = useState(false);

  const {
    chosenObjectName,
    handleBack,
    editedObject,
    chosenObjectId,
    chosenProjectId,
    isReprompt,
    repromptsQueue,
    isShapeAPISupported
  } = props;
  const { isEdit, editImportType } = editedObject;
  const { chapterKey, visualizationKey, vizDimensions } = lastSelectedViz;

  const vizData = useMemo(() => vizualizationsData.find(
    el => (el.visualizationKey === visualizationKey
    && el.chapterKey === chapterKey)
  ), [chapterKey, visualizationKey, vizualizationsData]);

  const isSelected = !!(chapterKey && visualizationKey);
  const isSupported = !!(isSelected && vizData && vizData.isSupported);
  const isChecking = !!(isSelected && (!vizData || (vizData && vizData.isSupported === undefined)));
  const isSecondaryDisabled = !isShapeAPISupported || isEdit;
  const primaryImportType = isEdit ? editImportType : objectImportType.TABLE;

  const handleCancel = () => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    popupHelper.officeMessageParent(message);
  };

  const { installSessionProlongingHandler } = sessionHelper;

  const prolongSession = installSessionProlongingHandler(handleCancel);

  const extendSession = useCallback((message = {}) => {
    const { data: postMessage, origin } = message;
    const { origin: targetOrigin } = window;
    if (origin === targetOrigin && postMessage === EXTEND_SESSION) {
      prolongSession();
    }
  }, [prolongSession]);

  useEffect(() => {
    window.addEventListener('message', extendSession);

    return () => window.removeEventListener('message', extendSession);
  }, [extendSession]);

  const handleSelection = useCallback(async (dossierData) => {
    const {
      chapterKey: chosenVizchapterKey,
      visualizationKey: chosenVizKey,
      vizDimensions: chosenVizDimensions,
      promptsAnswers: chosenVizPromptAnswers,
      instanceId: chosenVizInstanceId
    } = dossierData;

    if (chosenVizInstanceId) {
      setLastSelectedViz({
        chapterKey: chosenVizchapterKey,
        visualizationKey: chosenVizKey,
        vizDimensions: chosenVizDimensions,
      });
      setPromptsAnswers(chosenVizPromptAnswers);
      instanceId.current = chosenVizInstanceId;

      if (!vizualizationsData.find(el => (
        el.visualizationKey === chosenVizKey
        && el.chapterKey === chosenVizchapterKey))) {
        let isVizSupported = true;

        const checkIfVizDataCanBeImported = async () => {
          await mstrObjectRestService.fetchVisualizationDefinition({
            projectId: chosenProjectId,
            objectId: chosenObjectId,
            instanceId: chosenVizInstanceId,
            visualizationInfo: { chapterKey: chosenVizchapterKey, visualizationKey: chosenVizKey }
          });
        };

        await Promise.all([
          checkIfVizDataCanBeImported(),
          // For future: add different checks if needed - e.g. visualization not included in dossier instance definition
        ])
          .catch(error => {
            console.error(error);
            const { ERR009 } = errorCodes;
            if (error.response && error.response.body.code === ERR009) {
              // Close popup if session expired
              popupHelper.handlePopupErrors(error);
            } else {
              isVizSupported = false;
            }
          });

        setVizualizationsData([...vizualizationsData, {
          chapterKey: chosenVizchapterKey,
          visualizationKey: chosenVizKey,
          isSupported: isVizSupported,
        }]);
      }
    }
  }, [chosenObjectId, chosenProjectId, vizualizationsData]);

  const handleOk = useCallback((importType = objectImportType.TABLE) => {
    const message = {
      command: selectorProperties.commandOk,
      chosenObjectName,
      chosenObject: chosenObjectId,
      chosenProject: chosenProjectId,
      chosenSubtype: mstrObjectEnum.mstrObjectType.visualization.subtypes,
      isPrompted: promptsAnswers?.answers?.length > 0,
      promptsAnswers,
      importType,
      visualizationInfo: {
        chapterKey,
        visualizationKey,
        vizDimensions,
      },
      preparedInstanceId: instanceId.current,
      isEdit,
    };
    popupHelper.officeMessageParent(message);
  }, [chapterKey, chosenObjectId, chosenObjectName, chosenProjectId,
    instanceId, isEdit, promptsAnswers, visualizationKey, vizDimensions]);

  // Automatically close popup if re-prompted dossier is answered
  // and visualization is selected
  useEffect(() => {
    if (isReprompt && isSelected) {
      handleOk(editImportType);

      // Hide embedded and let loading spinner show while prompts are being answered.
      setHideEmbedded(true);
    }
  }, [isReprompt, isSelected, editImportType, handleOk]);

  /**
   * Store new instance id in state.
   * Unselect visualization after instanceId changed.
   * Restore backuped viz selection info in case of return to previous instance.
   * Above happens on reprompt button click followed by cancel button click in reprompt popup.
   *
   * @param {String} newInstanceId
   */
  const handleInstanceIdChange = useCallback((newInstanceId) => {
    const backup = previousSelectionBackup.current.find((el) => el.instanceId === newInstanceId);

    if (instanceId.current !== newInstanceId && !backup) {
      const currentInstanceId = instanceId.current;
      // Make a backup of last selection info.
      previousSelectionBackup.current = [{ currentInstanceId, lastSelectedViz, }, ...previousSelectionBackup.current];
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
  }, [handleSelection, lastSelectedViz, promptsAnswers, vizualizationsData]);

  /**
   * Store new prompts answers in state
   *
   * @param {Array} newAnswers
   */
  const handlePromptAnswer = useCallback((newAnswers) => {
    setPromptsAnswers(newAnswers);
    vizualizationsData?.length > 0 && setVizualizationsData([]);
  }, [vizualizationsData]);

  /**
  * Change state of component so that informative message is showed only after embedded dossier is loaded.
  *
  */
  const handleEmbeddedDossierLoad = useCallback(() => {
    setIsEmbeddedDossierLoaded(true);
  }, []);

  const validateSession = useCallback(() => {
    authenticationHelper.validateAuthToken().catch((error) => {
      popupHelper.handlePopupErrors(error);
    });
  }, []);

  return (
    <div className="dossier-window">
      { isEmbeddedDossierLoaded
        && (
          <span className="dossier-window-information-frame">
            <MSTRIcon
              clasName="dossier-window-information-icon"
              type="info-icon"
            />
            <span className="dossier-window-information-text">
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
      <Empty isLoading />
      {!hideEmbedded && ( // Hide embedded dossier only after prompts are answered.
        <>
          <EmbeddedDossier
            handleSelection={handleSelection}
            handlePromptAnswer={handlePromptAnswer}
            handleInstanceIdChange={handleInstanceIdChange}
            handleIframeLoadEvent={validateSession}
            handleEmbeddedDossierLoad={handleEmbeddedDossierLoad}
          />
          <PopupButtons
            handleOk={() => handleOk(primaryImportType)}
            handleSecondary={() => handleOk(objectImportType.IMAGE)}
            hideSecondary={isSecondaryDisabled}
            primaryImportType={primaryImportType}
            shouldShowImportImage
            handleCancel={handleCancel}
            handleBack={!isEdit && handleBack}
            disableActiveActions={!isSelected}
            isPublished={!(isSelected && !isSupported && !isChecking)}
            disableSecondary={isSelected && !isSupported && !isChecking}
            checkingSelection={isChecking}
            hideOk={isReprompt}
          />
        </>
      )}
    </div>
  );
};

DossierWindowNotConnected.propTypes = {
  chosenObjectId: PropTypes.string,
  chosenObjectName: PropTypes.string,
  chosenProjectId: PropTypes.string,
  isShapeAPISupported: PropTypes.bool,
  handleBack: PropTypes.func,
  editedObject: PropTypes.shape({
    chosenObjectId: PropTypes.string,
    projectId: PropTypes.string,
    isEdit: PropTypes.bool,
    instanceId: PropTypes.string,
    dossierName: PropTypes.string,
    promptsAnswers: PropTypes.shape({
      answers: PropTypes.arrayOf(PropTypes.shape({})),
      messageName: PropTypes.string,
    }),
    selectedViz: PropTypes.string,
    editImportType: PropTypes.string,
  }),
  isReprompt: PropTypes.bool,
  repromptsQueue: PropTypes.shape({
    total: PropTypes.number,
    index: PropTypes.number,
  }),
};

DossierWindowNotConnected.defaultProps = {
  chosenObjectId: 'default id',
  chosenObjectName: DEFAULT_PROJECT_NAME,
  chosenProjectId: 'default id',
  isShapeAPISupported: false,
  handleBack: () => {},
  editedObject: {
    chosenObjectId: undefined,
    projectId: undefined,
    isEdit: false,
    instanceId: undefined,
    dossierName: undefined,
    promptsAnswers: {
      answers: [],
      messageName: '',
    },
    selectedViz: '',
    editImportType: objectImportType.TABLE,
  },
  isReprompt: false,
  repromptsQueue: {
    total: 0,
    index: 0,
  },
};

function mapStateToProps(state) {
  const {
    navigationTree, popupReducer, sessionReducer, objectReducer,
    officeReducer, answersReducer, popupStateReducer, repromptsQueueReducer
  } = state;
  const {
    chosenObjectName,
    chosenObjectId,
    chosenProjectId,
    promptsAnswers,
    promptObjects,
    importRequested
  } = navigationTree;
  const { editedObject } = popupReducer;
  const { supportForms, isShapeAPISupported } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const { answers } = answersReducer;
  const isReport = editedObject && editedObject.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  const { objects } = objectReducer;
  const editedObjectParse = {
    ...popupHelper.parsePopupState(
      editedObject,
      promptsAnswers,
      formsPrivilege
    ),
  };
  const importType = objects.find(obj => obj.objectId === editedObjectParse.chosenObjectId)?.importType
    || objectImportType.TABLE;
  editedObjectParse.editImportType = importType;
  return {
    chosenObjectName: editedObject
      ? editedObjectParse.dossierName
      : chosenObjectName,
    chosenObjectId: editedObject
      ? editedObjectParse.chosenObjectId
      : chosenObjectId,
    chosenProjectId: editedObject
      ? editedObjectParse.projectId
      : chosenProjectId,
    editedObject: editedObjectParse,
    previousPromptsAnswers: answers,
    promptObjects,
    importRequested,
    isShapeAPISupported,
    isReprompt: popupStateReducer.isReprompt,
    repromptsQueue: { ...repromptsQueueReducer },
  };
}

const mapActionsToProps = { handleBack: popupStateActions.onPopupBack };

export const DossierWindow = connect(mapStateToProps, mapActionsToProps)(DossierWindowNotConnected);
