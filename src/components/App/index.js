import React, { Component } from 'react';
import {connect} from 'react-redux';
import './App.css';

import Menu from 'components/Menu';

import { Switch } from 'antd';

export default connect((state) => ({
    ...state
}))
class App extends Component {
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