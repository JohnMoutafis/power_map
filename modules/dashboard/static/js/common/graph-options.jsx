const productionColors = [
  '#5d4037', '#607d8b', '#9e9e9e', '#212121',
  '#996600', '#000000', '#b2ebf2', '#bcaaa4',
  '#f57c00', '#81d4fa', '#4fc3f7', '#2196f3',
  '#3f51b5', '#CCFF00', '#fafafa', '#e8f5e9',
  '#ffeb3b', '#827717', '#e1f5fe', '#b2dfdb'
];

const forecastColors = [
  '#ffeb3b', '#4fc3f7', '#81d4fa',
  '#228B22', '#FF4500'
];

export const simpleGraphOptions = function (countries, series) {
  return {
    chart: {
      type: 'column',
      height: '49%'
    },
    title: {
      text: 'Capacity per Country'
    },
    colors: productionColors,
    xAxis: {
      categories: countries
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Capacity in KWh'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'gray'
        }
      }
    },
    legend: {
      y: 25,
      align: 'right',
      verticalAlign: 'top',
      floating: true,
      backgroundColor: 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
    },
    loading: {
      hideDuration: 100,
      showDuration: 100,
      labelStyle: {"fontWeight": "bold", "position": "relative", "top": "45%"},
      style: {"position": "absolute", "backgroundColor": "#ffffff", "opacity": 0.5, "textAlign": "center"}
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          color: 'white'
        }
      }
    },
    series: series
  };
};


export const timeseriesGraphOptions = function (title, categories, series) {
  let graphColors = productionColors;
  if(title.toLowerCase().includes('forecast')){graphColors = forecastColors}
  return {
    chart: {
      type: 'column',
      height: '49%'
    },
    title: {
      text: title + ' per Country'
    },
    colors: graphColors,
    xAxis: {
      categories: categories,
    },
    yAxis: {
      min: 0,
      title: {
        text: title + ' in KWh'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'gray'
        }
      }
    },
    legend: {
      y: 25,
      align: 'right',
      verticalAlign: 'top',
      floating: true,
      backgroundColor: 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
    },
    loading: {
      hideDuration: 100,
      showDuration: 100,
      labelStyle: {"fontWeight": "bold", "position": "relative", "top": "45%"},
      style: {"position": "absolute", "backgroundColor": "#ffffff", "opacity": 0.5, "textAlign": "center"}
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    scrollbar: {
      enabled: true
    },
    plotOptions: {
      connectNulls: true,
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          color: 'white'
        }
      }
    },
    series: series
  };
};