import React  from 'react';
import ReactDom from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import App from './App';

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
});

ReactDom.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline/>
    <App/>
  </MuiThemeProvider>,
  document.getElementById('react-app')
);
