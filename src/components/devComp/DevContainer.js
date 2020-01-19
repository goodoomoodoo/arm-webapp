import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setConsoleInstruction, 
    setConsoleOutput } from '../../redux/actions/index';
import Instruction from '../../js/Instruction';

import '../../styles/DevContainer.css';

class DevContainer extends Component {

    constructor( props ) {

        super( props );

        this.state = {
            error: '',
            instruction: "",
            line: 1,
            instrCounter: 0             // Instruction index
        };

        this.handleInput = this.handleInput.bind( this );
        this.handleTab   = this.handleTab.bind( this );
        this.handleRun   = this.handleRun.bind( this );
        this.handleDebug = this.handleDebug.bind( this );
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

    handleDebug() {

        let instrArr = this.state.instruction.split( '\n' );

        Instruction.setProgramCounter( 0x8000 );
        this.setState({ instrCounter: 0 });

        let instrObj = Instruction.transpileInstrArr( instrArr );

        this.props.setConsoleOutput({ 
            exitCode: instrObj.exitCode,
            msgArr: instrObj.msgArr });

        this.setState({ instrObj: instrObj });

        if( instrObj.exitCode === 0 )
            this.props.setConsoleInstruction({ instr: instrObj.jsArr[ 0 ] } );
        else
            this.props.setConsoleInstruction({ 
                instr: undefined } );
    }

    handleRun() {

        let instrArr = this.state.instruction.split( '\n' );
        Instruction.setProgramCounter( 0x8000 );
        Instruction.runInstrArr( instrArr );
    }

    handleStep() {

        if( this.state.instrObj != undefined &&
            this.state.instrCounter < this.state.instrObj.jsArr.length ) {
            
            let currInstr = this.state.instrObj.jsArr[ this.state.instrCounter ];
            Instruction.step( currInstr );
            
            setTimeout( () => {
                let counter = ( this.props.register[ 'pc' ] - 0x8000 ) >>> 2;
                this.setState({ instrCounter: counter });
            }, 0 );

            let nextInstr = this.state.instrObj
                .jsArr[ this.state.instrCounter + 1 ];

            if( nextInstr == undefined )
                this.props.setConsoleInstruction({ 
                    instr: { iname: 'Program exited.' } });
            else
                this.props.setConsoleInstruction({ instr: nextInstr });
        } else {
            console.log( 'Program exited: 0' );
        }
    }

    render() {
        return (
            <div className="DevContainer">
                <div className="DevActions">
                    <button>Finish</button>
                    <button>Next</button>
                    <button onClick={this.handleStep}>Step</button>
                    <button onClick={this.handleDebug}>Debug</button>
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

export default connect( mapStateToProps, mapDispatchToProps )( DevContainer );