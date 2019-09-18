import * as types from '../types';


const INITIAL_STATE = {
  selectedCountries: []
};


const selectCountry = function(state, action) {
  let currSelected = state.selectedCountries;
  currSelected.push(action.country);
  return {
    ...state,
    selectCountries: currSelected.sort()
  }
};

const deselectCountry = function(state, action) {
  let currSelected = state.selectedCountries;
  return {
    ...state,
    selectCountries: currSelected.splice(state.selectedCountries.indexOf(action.country), 1)
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