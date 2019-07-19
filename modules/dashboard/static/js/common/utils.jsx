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
  let countries = [];
  let dates = [];
  let hours = [];
  let generationDataCollection = JSON.parse(JSON.stringify(productionDataCollectionBlueprint));
  for(const country of graphData){
    if(!countries.includes(country.country.name)){
      countries.push(country.country.name);
    }
    if(!dates.includes(country.reference_date)){
      dates.push(country.reference_date)
    }
    for(const hourlyGeneration of country.hourly_generation){
      hours.push(hourlyGeneration.hour_frame);
      for(const generation of Object.keys(hourlyGeneration)){
        if(generation in generationDataCollection){
          generationDataCollection[generation].data.push(hourlyGeneration[generation]);
          // if(!('xAxis' in generationDataCollection[generation])){
          //   generationDataCollection[generation]['xAxis'] = 1;
          // }
        }
      }
    }
  }
  return {
    countries: countries,
    dates: dates,
    hours: hours,
    series: Object.keys(generationDataCollection).map(key => generationDataCollection[key])
  };
}