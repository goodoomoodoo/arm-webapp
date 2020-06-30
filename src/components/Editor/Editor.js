import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setConsoleInstruction, 
    setConsoleOutput } from '../../redux/actions/index';
import Simulation from '../../js/Simulation';

import './Editor.css';

class Editor extends Component {

    constructor( props ) {

        super( props );

        this.state = {
            error: '',
            instruction: '',
            pureInstruction: [],
            line: 1,
            statusCode: 0
        };

        this.simulation = undefined;
        this.handleInput = this.handleInput.bind( this );
        this.handleTab   = this.handleTab.bind( this );
        this.handleRun   = this.handleRun.bind( this );
        this.handleBuild = this.handleBuild.bind( this );
        this.handleStep  = this.handleStep.bind( this );
    }

    createLineNumber = ( count ) => {
        let arr = [];

        for( let i = 0; i < count; i++ )
            arr.push( <span key={i}>{i + 1}</span> );

        return arr;
    }

    handleTab( e ) {        
        if( e.keyCode == 9 ) {
            e.preventDefault();
            this.setState({ instruction: this.state.instruction + '\t' });
        }
    }

    handleInput( e ) {
        e.preventDefault();

        this.setState({
            [e.target.name]: e.target.value
        });

        let ta = document.querySelector( 'textarea' );
        ta.style.cssText = 'height: calc( 100% - 6px );';
        ta.style.cssText = 'height: ' + ta.scrollHeight + 'px';

        let lineCount = e.target.value.split( '\n' ).length;
        this.setState({ line: lineCount });
    }

    handleBuild() {

        let instructionArray = this.state.instruction.split( '\n' );

        this.simulation = new Simulation(instructionArray);

        this.setState({
            pureInstruction: this.simulation.assembler.getPureInstruction()
        });

        this.simulation.assemble()
            .then(val => {
                this.props.setConsoleOutput({
                    exitCode: 0,
                    message: 'Build complete.'
                });
            })
            .catch(error => {
                this.props.setConsoleOutput({
                    exitCode: 10,
                    message: error.message
                });
            });
    }

    handleRun() {
        // TODO
    }

    handleStep() {

        let exitCode = this.simulation.step();

        if (exitCode === 1) {
            this.props.setConsoleOutput({
                exitCode: 1,
                message: 'Please build the program.'
            });
        } else if (exitCode === 2) {
            this.props.setConsoleInstruction({
                message: 'Program exited.'
            });
        } else {

        }
    }

    render() {
        return (
            <div className="Editor">
                <div className="DevActions">
                    <button>Finish</button>
                    <button>Next</button>
                    <button onClick={this.handleStep}>Step</button>
                    <button onClick={this.handleBuild}>Build</button>
                    <button onClick={this.handleRun}>Run</button>           
                </div>
                <div className="DevEditor">
                    <div className="DevLineNumber">
                        {this.createLineNumber( this.state.line )}
                    </div>
                    <textarea name="instruction" 
                        value={this.state.instruction}
                        onChange={this.handleInput}
                        onKeyDown={this.handleTab}
                    ></textarea>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setConsoleOutput: payload => dispatch( setConsoleOutput( payload ) ),
        setConsoleInstruction: payload => 
            dispatch( setConsoleInstruction( payload ) )
    }
};

const mapStateToProps = state => {
    // have to return an object otw the react component cannot compare to
    // previous state
    return { register: state.register };
}

export default connect( mapStateToProps, mapDispatchToProps )( Editor );