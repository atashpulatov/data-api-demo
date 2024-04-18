import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { PopupProps, PopupTypes } from '@mstr/connector-components';

import { sidePanelNotificationHelper } from '../side-panel-services/side-panel-notification-helper';

import { officeSelectors } from '../../redux-reducer/office-reducer/office-reducer-selectors';

interface UseGetUpdatedDuplicatePopupProps {
  sidePanelPopup: PopupProps;
  setSidePanelPopup: React.Dispatch<PopupProps>;
}

interface DuplicatePopupParams {
  activeCellAddress: string;
  setDuplicatedObjectId: React.Dispatch<any>;
  setSidePanelPopup: React.Dispatch<PopupProps>;
}

/**
 * Gets the updated duplicate popup together with new activeCellAddress
 * @param sidePanelPopup - the current side panel popup
 * @param duplicatedObjectId - the object id to duplicate
 * @param duplicatePopupParams - the parameters for the duplicate popup
 */
export const useGetUpdatedDuplicatePopup = ({
  sidePanelPopup,
  setSidePanelPopup,
}: UseGetUpdatedDuplicatePopupProps): DuplicatePopupParams => {
  const [duplicatedObjectId, setDuplicatedObjectId] = useState(null);
  const activeCellAddress = useSelector(officeSelectors.selectActiveCellAddress);

  const duplicatePopupParams = useMemo(
    () => ({
      activeCellAddress,
      setDuplicatedObjectId,
      setSidePanelPopup,
    }),
    [setSidePanelPopup, activeCellAddress]
  );

  useEffect(() => {
    if (
      sidePanelPopup !== null &&
      sidePanelPopup.type === PopupTypes.DUPLICATE &&
      duplicatedObjectId !== null
    ) {
      sidePanelNotificationHelper.setDuplicatePopup({
        objectWorkingId: duplicatedObjectId,
        ...duplicatePopupParams,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duplicatePopupParams.activeCellAddress]);

  return duplicatePopupParams;
};
