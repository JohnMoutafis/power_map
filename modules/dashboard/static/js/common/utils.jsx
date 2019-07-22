const productionDataCollectionBlueprint = {
  'biomass': {name: 'biomass', data: []},
  'fossil_coal_derived_gas': {name: 'fossil_coal_derived_gas', data: []},
  'fossil_gas': {name: 'fossil_gas', data: []},
  'fossil_hard_coal': {name: 'fossil_hard_coal', data: []},
  'fossil_lignite': {name: 'fossil_lignite', data: []},
  'fossil_oil': {name: 'fossil_oil', data: []},
  'fossil_oil_shale': {name: 'fossil_oil_shale', data: []},
  'fossil_peat': {name: 'fossil_peat', data: []},
  'geothermal': {name: 'geothermal', data: []},
  'hydro_pumped_storage': {name: 'hydro_pumped_storage', data: []},
  'hydro_river_and_poundage': {name: 'hydro_river_and_poundage', data: []},
  'hydro_water_reservoir': {name: 'hydro_water_reservoir', data:[]},
  'marine': {name: 'marine', data: []},
  'nuclear': {name: 'nuclear', data: []},
  'other': {name: 'other', data: []},
  'other_renewable': {name: 'other_renewable', data: []},
  'solar': {name: 'solar', data: []},
  'waste': {name: 'waste', data: []},
  'wind_offshore': {name: 'wind_offshore', data: []},
  'wind_onshore': {name: 'wind_onshore', data: []}
};


export function createCapacityDataLists(graphData) {
  let countries = [];
  let capacityDataCollection = JSON.parse(JSON.stringify(productionDataCollectionBlueprint));
  for(const item of graphData) {
    countries.push(item.country.name);
    for(const production of Object.keys(item)) {
      if(production in capacityDataCollection) {
        capacityDataCollection[production].data.push(item[production]);
      }
    }
  }
  return {
    categories: countries,
    series: Object.keys(capacityDataCollection).map(key => capacityDataCollection[key])
  };
}


export function createGenerationDataLists(graphData) {
  let categories = {};
  let generationDataCollection = JSON.parse(JSON.stringify(productionDataCollectionBlueprint));
  for(const country of graphData){
    if(!(country.country.name in categories)){
      categories[country.country.name] = {
        name: country.country.name,
        categories: []
      };
    }
    if(country.hourly_generation.length){
      let ref_date = {
        name: country.reference_date,
        categories: []
      };
      for(const hourlyGeneration of country.hourly_generation){
        ref_date.categories.push(hourlyGeneration.hour_frame);
        for(const generation of Object.keys(hourlyGeneration)){
          if(generation in generationDataCollection){
            generationDataCollection[generation].data.push(hourlyGeneration[generation]);
          }
        }
      }
      categories[country.country.name].categories.push(ref_date);
    }
  }
  return {
    categories: Object.keys(categories).map(key => categories[key]),
    series: Object.keys(generationDataCollection).map(key => generationDataCollection[key])
  }
}


export function createForecastDataList(graphData) {
  let categories = {};
  let forecastDataCollection = {
    'solar_forecast': {name: 'solar_forecast', data: [], stack: 'wind_solar_forecast'},
    'wind_onshore_forecast': {name: 'wind_onshore__forecast', data: [], stack: 'wind_solar_forecast'},
    'wind_offshore_forecast': {name: 'wind_offshore_forecast', data: [], stack: 'wind_solar_forecast'},
    'generation_forecast': {name: 'generation_forecast', data: [], stack: 'generation_forecast'},
    'consumption_forecast': {name: 'consumption_forecast', data: [], stack: 'consumption_forecast'}
  };
  for(const country of graphData) {
    if (!(country.country.name in categories)) {
      categories[country.country.name] = {
        name: country.country.name,
        categories: []
      };
    }
    if (country.forecast.length) {
      let ref_date = {
        name: country.reference_date,
        categories: []
      };
      for (const index in country.forecast) {
        ref_date.categories.push(country.forecast[index].hour_frame);
        for(const item of Object.keys(country.forecast[index])){
          if(item in forecastDataCollection){
            forecastDataCollection[item].data.push(country.forecast[index][item]);
          }
        }
        for(const item of Object.keys(country.wind_solar_forecast[index])){
          if(item in forecastDataCollection){
            forecastDataCollection[item].data.push(country.wind_solar_forecast[index][item]);
          }
        }
      }
      categories[country.country.name].categories.push(ref_date);
    }
  }
  return {
    categories: Object.keys(categories).map(key => categories[key]),
    series: Object.keys(forecastDataCollection).map(key => forecastDataCollection[key])
  }
}