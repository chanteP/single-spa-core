import React, { Component } from 'react';
import logo from './logo.svg';

import './App.css';
import "antd/dist/antd.css";

import { Switch } from 'antd';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch defaultChecked onChange={onChange} />
        12312
      </div>
    );
  }
}

export default App;


function onChange(checked) {
  console.log(`switch to ${checked}`);
}
