import React, { Component } from 'react';

import '../styles/Log.css';

class Log extends Component {

    render() {
        return (
            <div className="Log">
                <h1>Log</h1>
                <div className="LogTitle">
                    <h2>Console Output</h2>
                </div>
                <h3>No Output.</h3>
                <div className="LogTitle">
                    <h2>Current Instruction</h2>
                </div>
                <h3>No instructions. Click [run] to run your code.</h3>
            </div>
        );
    }
}

export default Log;