import {
  FETCH_TRENDING_FAILED,
  FETCH_TRENDING_SUCCESS,
  PROCESS_FETCH_TRENDING,
  ADDED_REPO,
  REMOVE_REPO,
} from "./types";
import { UPDATE_DATE_TYPE, UPDATE_LANGUAGE } from "../preference/types";

export const initialState = {
  processing: [false],
  // Array of objects with the below format
  // [
  //    { start: '', end: '', data: [] },
  //    { start: '', end: '', data: [] }
  // ]
  repositories: [[]],
  error: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case PROCESS_FETCH_TRENDING:
      const procss = state.processing;
      procss[action.index] = true;
      return {
        ...state,
        processing: [...procss],
        error: null,
      };
    case UPDATE_DATE_TYPE:
    case UPDATE_LANGUAGE:
      return {
        ...state,
        repositories: new Array(state.repositories.length).fill([]),
        // ...initialState,
      };
    case ADDED_REPO:
      return { ...state, repositories: [...state.repositories, []] };
    case REMOVE_REPO:
      if (state.repositories.length > 1)
        return { ...state, repositories: state.repositories.slice(0, -1) };
      return { ...state };
    case FETCH_TRENDING_SUCCESS:
      const clone = { ...state };
      clone.repositories[action.payload.index] = action.payload.reset
        ? [action.payload]
        : [...clone.repositories[action.payload.index], action.payload];
      clone.processing[action.payload.index] = false;
      return {
        ...state,
        // Append the fetched repositories to existing list
        repositories: clone.repositories,
        processing: [...clone.processing],
        error: null,
      };
    case FETCH_TRENDING_FAILED:
      const procs = state.processing;
      procs[action.index] = false;
      return {
        ...state,
        processing: [...procs],
        error: action.payload,
      };
    default:
      return state;
  }
}
