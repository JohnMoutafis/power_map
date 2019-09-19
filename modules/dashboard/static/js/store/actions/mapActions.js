import {COUNTRY_SELECT, COUNTRY_DESELECT} from '../types/mapTypes';

export const countrySelect = (country) => ({
  type: COUNTRY_SELECT, country
});

export const countryDeselect = (country) => ({
  type: COUNTRY_DESELECT, country
});