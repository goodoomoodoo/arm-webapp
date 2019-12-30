import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setRegister, procStack, setConsoleOutput } from '../../redux/actions/index';
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
        this.resolveRes  = this.resolveRes.bind( this );
    }

    createLineNumber = ( count ) => {
        let arr = [];

        for( let i = 0; i < count; i++ )
            arr.push( <span key={i}>{i + 1}</span> );

        return arr;
    }

    resolveRes( obj ) {

        if( obj.opType == 1 ) {

            this.props.setRegister({ id: obj.register, value: obj.value });

        } else if( obj.opType == 2 ) {

            this.props.setRegister({ id: obj.register, value: obj.value });
            this.props.procStack({ addr: obj.address, value: obj.value });

        } else if( obj.opType == 3 ) {
            
            let i = 0;
            for( ; i < obj.actions.length - 1 ; i++ ) {

                this.props.setRegister({ 
                    id: obj.actions[ i ].register, 
                    value: obj.actions[ i ].value 
                });
                this.props.procStack({ 
                    addr: obj.actions[ i ].address, 
                    value: obj.actions[ i ].value
                });
            }

            this.props.setRegister({ 
                id: obj.actions[ i ].register,
                value: obj.actions[ i ].value
            });
        }

        this.props.setRegister({ id: 'pc', value: this.props.pc + 4 });
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

        this.props.setRegister({ id: 'pc', value: 0x8000 });
        Instruction.setProgramCounter( 0x8000 );
        this.setState({ instrCounter: 0 });

        let instrObj = Instruction.transpileInstrArr( instrArr );

        if( instrObj.exitCode == 1 ) {

            for( let i = 0; i < instrObj.msgArr.length; i++ ) {

                console.log( instrObj.msgArr[ i ] );
            }
        }

        this.props.setConsoleOutput({ msgArr: instrObj.msgArr });

        console.log( instrObj );

        this.setState({ instrObj: instrObj });
    }

    handleRun() {

        let instrArr = this.state.instruction.split( '\n' );
        this.props.setRegister({ id: 'pc', value: 0x8000 });
        Instruction.setProgramCounter( 0x8000 );
        Instruction.runInstrArr( instrArr );
    }

    handleStep() {

        if( this.state.instrObj != undefined &&
            this.state.instrCounter < this.state.instrObj.jsArr.length ) {
            
            let currInstr = this.state.instrObj.jsArr[ this.state.instrCounter ];
            Instruction.step( currInstr.opType, currInstr.iname, 
                currInstr.argo );
            
            setTimeout( () => {
                let counter = ( this.props[ 'pc' ] - 0x8000 ) >>> 2;
                this.setState({ instrCounter: counter });
            }, 0 );
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
        setRegister: payload => dispatch( setRegister( payload ) ),
        procStack: payload => dispatch( procStack( payload ) ),
        setConsoleOutput: payload => dispatch( setConsoleOutput( payload ) )
    }
};

const mapStateToProps = state => {
    return state.register;
}

export default connect( mapStateToProps, mapDispatchToProps )( DevContainer );