import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../styles/Log.css';

class Log extends Component {

    render() {
        return (
            <div className="Log">
                <h1>Log</h1>
                <div className="LogTitle">
                    <h2>Console Output</h2>
                </div>
                <div className="LogBox">
                    {
                        this.props.output.length === 0 &&
                        <h3>No Output.</h3>
                    }
                    {
                        this.props.output.length !== 0 &&
                        this.props.output.map( ( msg, i ) => {
                            return (
                            <h3 className="Error" key={i}>{msg}</h3>
                            )
                        })
                    }
                </div>
                <div className="LogTitle">
                    <h2>Current Instruction</h2>
                </div>
                <h3>No instructions. Click [run] to run your code.</h3>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.console;
}

export default connect( mapStateToProps )( Log );