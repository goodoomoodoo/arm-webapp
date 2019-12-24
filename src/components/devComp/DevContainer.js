import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setRegister, procStack } from '../../redux/actions/index';
import Instruction from '../../js/Instruction';

import '../../styles/DevContainer.css';

class DevContainer extends Component {

    constructor( props ) {

        super( props );

        this.state = {
            error: '',
            instruction: "",
            line: 1,
            objArr: null,               // Array of all instruction
            instrCounter: 0             // Instruction index
        };

        this.handleInput  = this.handleInput.bind( this );
        this.handleTab    = this.handleTab.bind( this );
        this.handleRun    = this.handleRun.bind( this );
        this.handleStep   = this.handleStep.bind( this );
        this.executeInstr = this.executeInstr.bind( this );
    }

    createLineNumber = ( count ) => {
        let arr = [];

        for( let i = 0; i < count; i++ )
            arr.push( <span key={i}>{i + 1}</span> );

        return arr;
    }

    executeInstr() {

        let obj = this.state.objArr[ this.state.instrCounter ];

        if( obj.opType == 1 )
            this.props.setRegister({ id: obj.register, value: obj.value });
        else if( obj.opType == 2 ) {
            this.props.setRegister({ id: obj.register, value: obj.value });
            this.props.procStack({ addr: obj.address, value: obj.value });
        }
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

    handleRun( e ) {
        e.preventDefault();

        let instrArr = this.state.instruction.split( '\n' );

        this.setState({ instrCounter: 0 });

 
        let resObj = Instruction.transpileInstrArr( instrArr );

        if( resObj.exitCode == 0 ) {
            let objArr = Instruction.debugInstrArr( instrArr );
            this.setState({ objArr: objArr });
            console.log( objArr );
        } else {
            console.log( 'Program exited ', resObj.exitCode );
            for( let i = 0; i < resObj.msgArr.length; i++ )
                console.log( resObj.msgArr[ i ] );
        }
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
                <div className="DevActions">
                    <button onClick={this.handleRun}>Run</button>
                    <button onClick={this.handleStep}>Step</button>
                    <button>Next</button>
                    <button>Finish</button>
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
        setRegister: payload => dispatch( setRegister( payload ) ),
        procStack: payload => dispatch( procStack( payload ) )
    }
};

const mapStateToProps = state => {
    return state.register;
}

export default connect( mapStateToProps, mapDispatchToProps )( DevContainer );