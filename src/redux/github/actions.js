import axios from "axios";
import moment from "moment";

import {
  FETCH_TRENDING_FAILED,
  FETCH_TRENDING_SUCCESS,
  PROCESS_FETCH_TRENDING,
} from "./types";

const API_URL = "https://api.github.com/search/repositories";

const transformFilters = (filters) => {
  const transformedFilters = {};

  const startMoment = moment(filters.dateRange.start);
  const endMoment = moment(filters.dateRange.end);
  const reposDate = `created:${startMoment.format()}..${endMoment.format()}`;
  const reposLanguage = filters.language ? `language:${filters.language} ` : "";

  transformedFilters.q = reposLanguage + reposDate;
  transformedFilters.sort = "stars";
  transformedFilters.order = "desc";

  return transformedFilters;
};

/**
 * @param {object} filters
 * @returns {Function}
 */
export const fetchTrending = function (filters, index, reset) {
  return (dispatch) => {
    dispatch({ type: PROCESS_FETCH_TRENDING, index });

    axios
      .get(API_URL, {
        params: transformFilters(filters),
        headers: {
          ...(filters.token ? { Authorization: `token ${filters.token}` } : {}),
        },
      })
      .then((response) => {
        dispatch({
          type: FETCH_TRENDING_SUCCESS,
          payload: {
            index,
            reset,
            start: moment(filters.dateRange.start).format(),
            end: moment(filters.dateRange.end).format(),
            data: response.data,
          },
        });
      })
      .catch((error) => {
        let message =
          error.response && error.response.data && error.response.data.message;

        if (!message) {
          message = error.message;
        }

        dispatch({
          type: FETCH_TRENDING_FAILED,
          payload: message,
          index,
        });
      });
  };
};
