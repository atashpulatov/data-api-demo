import React from 'react';
import {AttributeSelectorWindow} from '../attribute-selector/attribute-selector-window';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {NavigationTree} from '../navigation/navigation-tree';
import {LoadingPage} from '../loading/loading-page';

export const PopupViewSelector = ({popupType, propsToPass, methods}) => {
  if (!popupType) {
    return <AttributeSelectorWindow parsed={propsToPass} handleBack={methods.handleBack} />;
  } else if (popupType === PopupTypeEnum.navigationTree) {
    return <NavigationTree handlePrepare={methods.handlePrepare} parsed={propsToPass} handlePopupErrors={methods.handlePopupErrors} />;
  } else if (popupType === PopupTypeEnum.loadingPage) {
    return <LoadingPage />;
  }
  return <></>;
};
