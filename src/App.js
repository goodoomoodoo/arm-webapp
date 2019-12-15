import React, { Component } from 'react';
import store from './redux/store/index';
import { Provider } from 'react-redux';

import Home from './components/Home';

import './app.css'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    )
  }
}

export default App;
