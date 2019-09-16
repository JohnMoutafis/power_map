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
      height: '47%',
    },
    title: {
      text: 'Generation Capacity of ' + countries.join(', ')
    },
    colors: productionColors,
    xAxis: {
      categories: countries,
    },
    yAxis: {
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
      y:25,
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      floating: false,
      backgroundColor: 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
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
    responsive: {
      rules: [{
        condition: { maxWidth: '700' },
        chartOptions: {
          tooltip: { enabled: false },
          legend: { enabled: false }
        }
      }]
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
      height: '47%',
      panning: true
    },
    title: {
      text: title + ' of ' + categories.map(category => (category.name)).join(', ')
    },
    colors: graphColors,
    xAxis: {
      min: 0,
      max: 14,
      categories: categories
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
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      floating: false,
      backgroundColor: 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      connectNulls: true,
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          color: 'white'
        },
      }
    },
    responsive: {
      rules: [{
        condition: { maxWidth: '500' },
        chartOptions: {
          tooltip: { enabled: false },
          legend: { enabled: false }
        }
      }]
    },
    series: series
  };
};