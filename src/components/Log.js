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
                        this.props.console.output.msgArr === undefined &&
                        <h3>No Output.</h3>
                    }
                    {
                        this.props.console.output.msgArr !== undefined &&
                        this.props.console.output.exitCode !== 0 &&
                        this.props.console.output.msgArr.map( ( msg, i ) => {
                            return (
                            <h3 className="Error" key={i}>{msg}</h3>
                            )
                        })
                    }
                    {
                        this.props.console.output.msgArr !== undefined &&
                        this.props.console.output.exitCode === 0 &&
                        <h3 className="Success">
                            {this.props.console.output.msgArr[ 0 ]}
                        </h3>
                    }
                </div>
                <div className="LogTitle">
                    <h2>Current Instruction</h2>
                </div>
                {
                    this.props.console.instr === undefined &&
                    <h3>No instructions. Click [run] to run your code.</h3>
                }
                {
                    this.props.console.instr !== undefined &&
                    <div className="LogInstruction">
                        <span className="Instruction">
                            {this.props.console.instr.iname}
                        </span>

                        {
                            this.props.console.instr.argo !== undefined &&
                            Object.keys( this.props.console.instr.argo )
                                .map( ( keys, i ) => {
                                    return (
                                    <span className="Arguement" key={i}>
                                        {this.props.console.instr.argo[ keys ]}
                                    </span>
                                    );
                                })

                        }
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { console: state.console };
}

export default connect( mapStateToProps )( Log );