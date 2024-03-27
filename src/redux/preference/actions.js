import { ADDED_REPO, REMOVE_REPO } from "../github/types";
import {
  ADDED_COLUMN,
  REMOVE_COLUMN,
  UPDATE_DATE_TYPE,
  UPDATE_LANGUAGE,
  UPDATE_OPTIONS,
  UPDATE_VIEW_TYPE,
} from "./types";

export const updateOptions = function (options) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_OPTIONS,
      payload: options,
    });
  };
};

export const updateViewType = function (viewType = "grid") {
  return (dispatch) => {
    dispatch({
      type: UPDATE_VIEW_TYPE,
      payload: viewType,
    });
  };
};

export const updateLanguage = function (language, index = 0) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_LANGUAGE,
      payload: language,
      index,
    });
  };
};

export const updateDateJump = function (dateJump, index) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_DATE_TYPE,
      payload: dateJump,
      index,
    });
  };
};
export const addColumn = function () {
  return (dispatch) => {
    dispatch({
      type: ADDED_COLUMN,
    });
    dispatch({
      type: ADDED_REPO,
    });
  };
};
export const removeColumn = function () {
  return (dispatch) => {
    dispatch({
      type: REMOVE_COLUMN,
    });
    dispatch({
      type: REMOVE_REPO,
    });
  };
};
