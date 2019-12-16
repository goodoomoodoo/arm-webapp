import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setRegister } from '../redux/actions/index';
import Instruction from '../js/Instruction';

import '../styles/DevContainer.css';

class DevContainer extends Component {

    constructor( props ) {

        super( props );

        this.state = {
            objArr: null,               // Array of all instruction
            instrCounter: 0             // Instruction index
        };

        this.handleInput = this.handleInput.bind( this );
        this.handleRun   = this.handleRun.bind( this );
        this.handleStep  = this.handleStep.bind( this );
        this.executeInstr = this.executeInstr.bind( this );
    }

    /**
     * 
     * @param {String} instrName name of the instruction
     * @param {Array} argv list of arguments
     */
    executeInstr( ) {

        let obj = this.state.objArr[ this.state.instrCounter ];

        if( obj.opType == 1 )
            this.props.setRegister({ id: obj.register, value: obj.value });
    }

    handleInput( e ) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleRun( e ) {
        e.preventDefault();

        let instrArr = this.state.instructions.split( '\n' );

        // TODO: check if all commands are valid
        // This step is probably gonna be done over a server

        // If all commands work
        // In test environment, assume it all works
        this.setState({ instrCounter: 0 });
        let objArr = Instruction.transpileInstrArr( instrArr );
        this.setState({ objArr: objArr });
    }

    handleStep() {
        if( this.state.instrCounter < this.state.objArr.length ) {

            this.executeInstr();
            this.setState({ instrCounter: this.state.instrCounter + 1 });
        } else {
            console.log( 'Program exited: 0' );
        }
    }

    render() {
        return (
            <div className="DevContainer">
                <textarea name="instructions" onChange={this.handleInput} 
                    value={this.state.instructions} />
                <button onClick={this.handleRun}>Run</button>
                <button onClick={this.handleStep}>Step</button>
                <button>Next</button>
                <button>Finish</button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setRegister: payload => dispatch( setRegister( payload ) )
    }
};

const mapStateToProps = state => {
    return state;
}

export default connect( mapStateToProps, mapDispatchToProps )( DevContainer );