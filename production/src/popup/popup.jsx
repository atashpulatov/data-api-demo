import React, { useCallback, useEffect } from "react";
import { libraryErrorController } from "@mstr/mstr-react-library";

import { popupHelper } from "./popup-helper";

import { selectorProperties } from "../attribute-selector/selector-properties";
import i18n from "../i18n";
import InternetConnectionError from "./internet-connection-error";
import { PopupViewSelector } from "./popup-view-selector";
import { SessionExtendingWrapper } from "./session-extending-wrapper";

export const Popup = () => {
  useEffect(() => {
    libraryErrorController.initializeHttpErrorsHandling(
      popupHelper.handlePopupErrors,
    );
  }, []);

  useEffect(() => {
    i18n.changeLanguage(Office.context.displayLanguage || "en-US");
  }, []);

  const closePopup = useCallback(() => {
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel };
    popupHelper.officeMessageParent(message);
  }, []);

  return (
    <SessionExtendingWrapper id="popup-wrapper" onSessionExpire={closePopup}>
      <InternetConnectionError />
      <PopupViewSelector />
    </SessionExtendingWrapper>
  );
};
