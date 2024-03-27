import {
  UPDATE_DATE_TYPE,
  UPDATE_LANGUAGE,
  UPDATE_OPTIONS,
  UPDATE_VIEW_TYPE,
  ADDED_COLUMN,
  REMOVE_COLUMN,
} from "./types";

const templatePref = {
  viewType: "list",
  dateJump: "week",
  language: "",
  options: {
    token: "",
  },
};
const initialState = {
  prefs: [templatePref],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADDED_COLUMN:
      return { prefs: [...state.prefs, templatePref] };
    case REMOVE_COLUMN:
      if (state.prefs.length != 1) {
        return { prefs: state.prefs.slice(0, -1) };
      }
      return state;
    case UPDATE_OPTIONS:
      state.prefs[action.index] = {
        ...state.prefs[action.index],
        options: action.payload,
      };
      return {
        prefs: state.prefs.map((pref, index) => ({
          ...pref,
          options: action.payload,
        })),
      };

    case UPDATE_DATE_TYPE:
      const clone1 = { ...state };
      clone1.prefs[action.index] = {
        ...clone1.prefs[action.index],
        dateJump: action.payload,
      };

      return { ...clone1 };

    case UPDATE_VIEW_TYPE:
      state.prefs[action.index] = {
        ...state.prefs[action.index],
        viewType: action.payload,
      };
      return { ...state };

    case UPDATE_LANGUAGE:
      const clone = { ...state };
      clone.prefs[action.index] = {
        ...clone.prefs[action.index],
        language: action.payload,
      };
      return { ...clone };

    default:
      return state;
  }
}
