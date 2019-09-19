import * as types from '../types';


const INITIAL_STATE = {
  selectedCountries: []
};


const selectCountry = function(state, action) {
  return {
    ...state,
    selectedCountries: [...state.selectedCountries, action.country].sort()
  }
};

const deselectCountry = function(state, action) {
  return {
    ...state,
    selectedCountries: state.selectedCountries.filter(country => country !== action.country)
  }
};

const countrySelectReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.COUNTRY_SELECT:
      return selectCountry(state, action);
    case types.COUNTRY_DESELECT:
      return deselectCountry(state, action);
    default:
      return state;
  }
};

export default countrySelectReducer;