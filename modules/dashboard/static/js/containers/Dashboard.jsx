import React, { Component } from 'react';
import AvailableInfo from '../components/AvailableInfo';
import CentralMap from '../components/CentralMap';
import Filters from './Filters';
import GraphModal from './GraphModal';
import GraphStorageArea from './GraphStorageArea';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = themes => ({
  root: {
    flexGrow: 1,
    paddingTop: 2,
    paddingLeft: 2,
  },
  paper: {
    width: '100%',
    height: '92vh',
    marginTop: themes.spacing(1)
  },
});


class Dashboard extends Component{
  constructor(props) {
    super(props);
    this.cleanFetchedData = this.cleanFetchedData.bind(this);
    this.fetchFromEndpoint = this.fetchFromEndpoint.bind(this);
    this.graphRenderingOption = this.graphRenderingOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSaveGraph = this.handleSaveGraph.bind(this);
    this.state = {
      fetchedEndpoint: '',
      availableInfo: [],
      endpointsData: [],
      savedGraphs: [],
    };
  }

  cleanFetchedData() {
    this.setState({
      fetchedEndpoint: '',
      endpointsData: []
    })
  }

  fetchAvailableInfo() {
    fetch('/api/v1/countries/available-info').then(
      results => {return results.json();}
    ).then(
      data => this.setState({availableInfo: data})
    ).catch(err => {throw err})
  }

  fetchFromEndpoint(endpoint) {
    fetch(endpoint).then(
      results => {return results.json();}
    ).then(
      data => this.setState({endpointsData: [...this.state.endpointsData, data]})
    ).catch(err => {throw err})
  }

  handleSubmit(endpoint, countries, dateFrom, dateTo, timeStart, timeEnd) {
    this.cleanFetchedData();
    let final_endpoint = endpoint.value;

    let country_iso2 = 'country_iso2=';
    for(const country of countries) {
      country_iso2 += (country.value + ',')
    }
    final_endpoint += '?' + country_iso2.slice(0, -1);

    if(dateTo != null) {
      if(endpoint.label === 'Generation Capacity') {
        final_endpoint += '&reference_year_before=' + dateTo;
      } else {
        final_endpoint += '&reference_date_before=' + dateTo
      }
    }
    if(dateFrom != null){
      if(endpoint.label === 'Generation Capacity') {
        final_endpoint += '&reference_year_after=' + dateFrom;
      } else {
        final_endpoint += '&reference_date_after=' + dateFrom;
      }
    }

    if(timeStart != null && endpoint.label !== 'Generation Capacity'){
      if(endpoint.label === 'Actual Generation'){
        final_endpoint += '&generation_time_after=' + timeStart;
      } else {
        final_endpoint += '&forecast_time_after=' + timeStart + '&wind_solar_time_after=' + timeStart;
      }
    }
    if(timeEnd != null && endpoint.label !== 'Generation Capacity'){
      if(endpoint.label === 'Actual Generation') {
        final_endpoint += '&generation_time_before=' + timeEnd;
      } else {
        final_endpoint += '&forecast_time_before=' + timeEnd + '&wind_solar_time_before=' + timeEnd;
      }
    }

    this.fetchFromEndpoint(final_endpoint);
    this.setState({fetchedEndpoint: endpoint.label});
  }

  graphRenderingOption(){ return(this.state.fetchedEndpoint); }

  handleSaveGraph(graph){
    let savedGraphs = [...this.state.savedGraphs];
    if(savedGraphs.length === 3){
      savedGraphs.shift();
    }
    savedGraphs.push(graph);
    this.setState({savedGraphs: savedGraphs});
  }

  componentDidMount() {
    this.fetchAvailableInfo();
  }

  render() {
    const {classes} = this.props;
    let graphToRender = this.graphRenderingOption();
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={1} >
            <Grid container item xs={8} spacing={1}>
              <Grid item  xs={4}>
                <Filters handleSubmit={this.handleSubmit} />
              </Grid>
              <Grid item xs={8}>
                <CentralMap />
              </Grid>
              <Grid item xs={12}>
                <AvailableInfo availableInfo={this.state.availableInfo} />
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <GraphStorageArea savedGraphs={this.state.savedGraphs}/>
            </Grid>
          </Grid>
          <GraphModal
            renderOption={graphToRender}
            displayData={this.state.endpointsData}
            handleSaveGraph={this.handleSaveGraph}
          />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(Dashboard);