import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TransferManager from "./transfer/components/manager/TransferManager";


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="App-intro">
          <TransferManager/>
        </div>
      </div>
    );
  }
}

export default App;
