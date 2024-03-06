/* eslint-disable react/no-danger */
// issue with proptype import
// eslint-disable-next-line simple-import-sort/imports
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import { notificationService } from "../notification-v2/notification-service";
import { homeHelper } from "./home-helper";

import i18n from "../i18n";
import { officeActions } from "../redux-reducer/office-reducer/office-actions";
import warningIcon from "./assets/icon_conflict.svg";

function clearData(objects) {
  notificationService.dismissNotifications();
  homeHelper.secureData(objects);
}

export const ConfirmationNotConnected = ({
  objects,
  isConfirm,
  toggleIsConfirmFlag,
}) => {
  const [t] = useTranslation("common", { i18n });

  useEffect(() => {
    const ua = window.navigator.userAgent;
    // this is fix IE11 - it didn't handle z-index properties correctly
    if (
      ua.indexOf("MSIE") > 0 ||
      !!navigator.userAgent.match(/Trident.*rv:11\./)
    ) {
      const elm = document.querySelector(".confirm-container");
      elm.style.zIndex = -1;
      setTimeout(() => {
        elm.style.zIndex = 3000;
      }, 100);
    }
  });

  const confirmationRef = React.useRef(null);

  React.useEffect(() => {
    const closeSettingsOnEsc = ({ keyCode }) => {
      keyCode === 27 && toggleIsConfirmFlag();
    };
    const closeSettingsOnClick = ({ target }) => {
      confirmationRef.current &&
        !confirmationRef.current.contains(target) &&
        toggleIsConfirmFlag();
    };

    const options = { capture: true };

    if (isConfirm) {
      document.addEventListener("keyup", closeSettingsOnEsc);
      document.addEventListener("click", closeSettingsOnClick, options);
    }
    return () => {
      document.removeEventListener("keyup", closeSettingsOnEsc);
      document.removeEventListener("click", closeSettingsOnClick, options);
    };
  }, [isConfirm, toggleIsConfirmFlag]);

  return (
    <>
      <div className="block-ui" />
      <div className="confirm-container" ref={confirmationRef}>
        <div className="confirm-header">
          <span className="confirm-header-icon">
            <img
              width="19px"
              height="18px"
              src={warningIcon}
              alt={t("Refresh failed icon")}
            />
          </span>
        </div>
        <div className="confirm-message">
          <div className="confirm-message-title">
            <div
              dangerouslySetInnerHTML={{
                __html: t("Are you sure you want to <span>Clear Data</span>?"),
              }}
            />
          </div>
          <div className="confirm-message-text">
            {t("This removes all MicroStrategy data from the workbook.")}
            <br />
            <div
              dangerouslySetInnerHTML={{
                __html: t(
                  "In order to re-import the data, you will have to click the <span>View Data</span> button, which will appear in the add-in panel.",
                ),
              }}
            />
          </div>
        </div>
        <div className="confirm-buttons">
          <button
            className="ant-btn"
            id="confirm-btn"
            type="button"
            onClick={() => clearData(objects)}
          >
            {t("OK")}
          </button>
          <button
            className="ant-btn"
            id="cancel-btn"
            type="button"
            onClick={() => toggleIsConfirmFlag(false)}
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
    </>
  );
};

ConfirmationNotConnected.propTypes = {
  objects: PropTypes.arrayOf(PropTypes.shape({})),
  isConfirm: PropTypes.bool,
  toggleIsConfirmFlag: PropTypes.func,
};

function mapStateToProps({ officeReducer, objectReducer }) {
  const { objects } = objectReducer;
  const { isConfirm } = officeReducer;
  return { objects, isConfirm };
}

const mapDispatchToProps = {
  toggleIsConfirmFlag: officeActions.toggleIsConfirmFlag,
};

export const Confirmation = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationNotConnected);
