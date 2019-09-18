import React  from 'react';
import ReactDom from 'react-dom';
import {createStore} from 'redux';
import { Provider } from 'react-redux';
import countrySelectReducer from './store/reducers/countrySelectReducer';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import App from './App';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const appStore = createStore(countrySelectReducer);

const RootApp = () => (
  <Provider store={appStore}>
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <App/>
    </MuiThemeProvider>
  </Provider>
);

ReactDom.render(<RootApp/>, document.getElementById('react-app'));
