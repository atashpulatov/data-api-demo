import React, {
  useEffect, useCallback, useState, useMemo
} from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { MSTRIcon } from '@mstr/mstr-react-library';
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

export const DossierWindowNotConnected = (props) => {
  const [t] = useTranslation('common', { i18n });
  const [promptsAnswers, setPromptsAnswers] = useState([]);
  const [instanceId, setInstanceId] = useState('');
  const [vizualizationsData, setVizualizationsData] = useState([]);
  const [lastSelectedViz, setLastSelectedViz] = useState({});
  const [isEmbeddedDossierLoaded, setIsEmbeddedDossierLoaded] = useState(false);
  const [previousSelectionBackup, setPreviousSelectionBackup] = useState([]);

  const {
    chosenObjectName, handleBack, editedObject, chosenObjectId,
    chosenProjectId, previousPromptsAnswers, importRequested, promptObjects,
  } = props;
  const { isEdit, isReprompted } = editedObject;
  const { chapterKey, visualizationKey } = lastSelectedViz;

  const vizData = useMemo(() => vizualizationsData.find(
    el => (el.visualizationKey === visualizationKey
    && el.chapterKey === chapterKey)
  ), [chapterKey, visualizationKey, vizualizationsData]);

  const isSelected = !!(chapterKey && visualizationKey);
  const isSupported = !!(isSelected && vizData && vizData.isSupported);
  const isChecking = !!(isSelected && (!vizData || (vizData && vizData.isSupported === undefined)));

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

  const handleSelection = async (dossierData) => {
    const {
      chapterKey: chosenVizchapterKey,
      visualizationKey: chosenVizKey,
      promptsAnswers: chosenVizPromptAnswers,
      instanceId: chosenVizInstanceId
    } = dossierData;

    if (chosenVizInstanceId) {
      setLastSelectedViz({
        chapterKey: chosenVizchapterKey,
        visualizationKey: chosenVizKey
      });
      setPromptsAnswers(chosenVizPromptAnswers);
      setInstanceId(chosenVizInstanceId);

      if (!vizualizationsData.find(el => (
        el.visualizationKey === chosenVizKey
        && el.chapterKey === chosenVizchapterKey))) {
        let isVizSupported = true;

        const checkIfVizDataCanBeImported = async () => {
          const temporaryInstanceDefinition = await mstrObjectRestService.fetchVisualizationDefinition({
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
  };

  const handleOk = () => {
    const message = {
      command: selectorProperties.commandOk,
      chosenObjectName,
      chosenObject: chosenObjectId,
      chosenProject: chosenProjectId,
      chosenSubtype: mstrObjectEnum.mstrObjectType.visualization.subtypes,
      isPrompted: false,
      promptsAnswers,
      visualizationInfo: {
        chapterKey,
        visualizationKey,
      },
      preparedInstanceId: instanceId,
      isEdit,
    };
    popupHelper.officeMessageParent(message);
  };

  /**
   * Store new instance id in state.
   * Unselect visualization after instanceId changed.
   * Restore backuped viz selection info in case of return to previous instance.
   * Above happens on reprompt button click followed by cancel button click in reprompt popup.
   *
   * @param {String} newInstanceId
   */
  const handleInstanceIdChange = (newInstanceId) => {
    const backup = previousSelectionBackup.find((el) => el.instanceId === newInstanceId);

    if (instanceId !== newInstanceId && !backup) {
      // Make a backup of last selection info.
      setPreviousSelectionBackup([{ instanceId, lastSelectedViz, }, ...previousSelectionBackup]);
      // Clear selection of viz and update instance id.
      setInstanceId(newInstanceId);
      setLastSelectedViz([]);
      setVizualizationsData([]);
    } else {
      // Restore backuped viz selection info in case of return to prev instance
      setVizualizationsData([]);
      handleSelection({
        ...backup.lastSelectedViz,
        promptsAnswers,
        instanceId: backup.instanceId,
      });
    }
  };

  /**
   * Store new prompts answers in state
   *
   * @param {Array} newAnswers
   */
  const handlePromptAnswer = (newAnswers) => {
    setPromptsAnswers(newAnswers);
    setVizualizationsData([]);
  };

  /**
  * Change state of component so that informative message is showed only after embedded dossier is loaded.
  *
  */
  const handleEmbeddedDossierLoad = () => {
    setIsEmbeddedDossierLoaded(true);
  };

  const validateSession = () => {
    authenticationHelper.validateAuthToken().catch((error) => {
      popupHelper.handlePopupErrors(error);
    });
  };

  if (isReprompted && isSelected) {
    handleOk();
  }

  return (
    <div className="dossier-window">
      <h1
        title={chosenObjectName}
        className="ant-col folder-browser-title dossier-title-margin-top"
      >
        {`${t('Import Dossier')} > ${chosenObjectName}`}
      </h1>

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

      <EmbeddedDossier
        handleSelection={handleSelection}
        handlePromptAnswer={handlePromptAnswer}
        handleInstanceIdChange={handleInstanceIdChange}
        handleIframeLoadEvent={validateSession}
        handleEmbeddedDossierLoad={handleEmbeddedDossierLoad}
      />
      { !isReprompted && (
        <PopupButtons
          handleOk={handleOk}
          handleCancel={handleCancel}
          handleBack={!isEdit && handleBack}
          hideSecondary
          disableActiveActions={!isSelected}
          isPublished={!(isSelected && !isSupported && !isChecking)}
          disableSecondary={isSelected && !isSupported && !isChecking}
          checkingSelection={isChecking}
        />
      )}
    </div>
  );
};

DossierWindowNotConnected.propTypes = {
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
    isReprompted: PropTypes.bool,
  }),
  previousPromptsAnswers: PropTypes.arrayOf(PropTypes.shape({})),
  importRequested: PropTypes.bool,
  promptObjects: PropTypes.arrayOf(PropTypes.shape({})),
};

DossierWindowNotConnected.defaultProps = {
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
    isReprompted: false,
  },
};

function mapStateToProps(state) {
  const {
    navigationTree, popupReducer, sessionReducer, officeReducer, answersReducer
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
  const { supportForms } = officeReducer;
  const { attrFormPrivilege } = sessionReducer;
  const { answers } = answersReducer;
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
    importRequested
  };
}

const mapActionsToProps = { handleBack: popupStateActions.onPopupBack };

export const DossierWindow = connect(mapStateToProps, mapActionsToProps)(DossierWindowNotConnected);
