import React, { Component } from 'react';
import './App.css';

import Menu from 'components/Menu';

import { Switch } from 'antd';

export default class App extends Component {
    render() {
        return (
            <div className="App">

            </div>
        );
    }
}

function onChange(checked) {
  console.log(`switch to ${checked}`);
}