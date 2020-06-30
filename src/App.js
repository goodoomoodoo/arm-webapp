import React, { Component } from 'react';
import store from './redux/store/index';
import { Provider } from 'react-redux';

import Interface from './components/Interface/index';

import './app.css'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Interface />
      </Provider>
    )
  }
}

export default App;
