import React, { Component } from 'react';
import { ResponsiveBar } from '@nivo/bar'


const keysMap = {
  'capacity/generation': [
    'biomass', 'fossil_coal_derived_gas', 'fossil_gas', 'fossil_hard_coal', 'fossil_lignite', 'fossil_oil',
    'fossil_oil_shale', 'fossil_peat', 'geothermal', 'hydro_pumped_storage', 'hydro_river_and_poundage',
    'hydro_water_reservoir', 'marine', 'nuclear', 'other', 'solar', 'waste', 'wind_offshore', 'wind_onshore',
    'other_renewable', 'total_capacity'
  ],
  'forecast': []
};

const indexByMap = {
  'capacity': 'country_name',
  'generation': 'hour_frame'
};


export default class Graph extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ResponsiveBar
        data={this.props.graphData[0]}
        keys={keysMap['capacity/generation']}
        indexBy={indexByMap['capacity']}
        groupMode='grouped'
        margin={{top: 50, right: 130, bottom: 50, left: 60}}
        padding={0.3}
        colors={{scheme: 'category10'}}
        borderColor={{from: 'color', modifiers: [['darker', 1.6]]}}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'KWh',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{from: 'color', modifiers: [['darker', 1.6]]}}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    )
  }
}
