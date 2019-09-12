import React, { Component } from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'


export default class AvailableInfo extends Component{
  constructor(props){ super(props); }

  render(){
    const columns = [
      {
        Header: 'Country',
        accessor: 'country'
      },
      {
        Header: 'Generation Capacity',
        columns: [
          { Header: 'From', accessor: 'capacity.from' },
          { Header: 'Until', accessor: 'capacity.to' }
        ]
      },
      {
        Header: 'Actual Generation',
        columns: [
          { Header: 'From', accessor: 'generation.from' },
          { Header: 'Until', accessor: 'generation.to' }
        ]
      },
      {
        Header: 'Generation Forecast',
        columns: [
          { Header: 'From', accessor: 'forecast.from' },
          { Header: 'Until', accessor: 'forecast.to' }
        ]
      }
    ];

    return(
      <ReactTable
        data={this.props.availableInfo}
        columns={columns}
        defaultPageSize={41}
        showPagination={false}
        style={{height: '100%', width: '98%'}}
        className="-striped -highlight"
      />
    )
  }
}
