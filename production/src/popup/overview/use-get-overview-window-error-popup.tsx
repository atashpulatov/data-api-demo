import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PopupTypes } from '@mstr/connector-components';

import overviewHelper from './overview-helper';

import { DuplicatePopup, PageByRefreshFailedPopup, RangeTakenPopup } from './overview-types';

import { officeSelectors } from '../../redux-reducer/office-reducer/office-reducer-selectors';

interface UseGetOverviewWindowErrorPopupProps {
  setDialogPopup: (
    dialogPopup: DuplicatePopup | RangeTakenPopup | PageByRefreshFailedPopup
  ) => void;
}

const useGetOverviewWindowErrorPopup = ({
  setDialogPopup,
}: UseGetOverviewWindowErrorPopupProps): void => {
  const popupData = useSelector(officeSelectors.selectPopupData);

  useEffect(() => {
    if (popupData) {
      const { type, objectWorkingId } = popupData;
      switch (type) {
        case PopupTypes.RANGE_TAKEN:
          overviewHelper.setRangeTakenPopup({
            objectWorkingIds: [objectWorkingId],
            setDialogPopup,
          });
          break;
        case PopupTypes.FAILED_TO_REFRESH_PAGES:
          overviewHelper.setPageByRefreshFailedPopup({
            objectWorkingIds: [objectWorkingId],
            setDialogPopup,
          });
          break;

        default:
          break;
      }
    } else {
      setDialogPopup(null);
    }
  }, [popupData, setDialogPopup]);
};

export default useGetOverviewWindowErrorPopup;