import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Console.css';

class Console extends Component {

    render() {
        return (
            <div className="Console">
                <div className="ConsoleTitle">
                    <h2>Console Output</h2>
                </div>
                <div className="ConsoleBox">
                    <ConsoleError error={this.props.console.error} />
                </div>
                <div className="ConsoleTitle">
                    <h2>Current Instruction</h2>
                </div>
                {
                    this.props.console.instr === undefined &&
                    <h3>No instructions. Click [run] to run your code.</h3>
                }
                {
                    this.props.console.instr !== undefined &&
                    <div className="ConsoleInstruction">
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

const ConsoleError = (props) => {
    const error = props.error;

    if (error.message === undefined)
        return <h3>No output.</h3>
    else if (error.exitCode === 1)
        return <h3 className='Error'>{error.message}</h3>
    else if (error.exitCode === 2)
        return <h3 className='Error'>{error.message}</h3>
    else
        return <h3 className='Success'>{error.message}</h3>
}

const mapStateToProps = state => {
    return { console: state.console };
}

export default connect( mapStateToProps )( Console );