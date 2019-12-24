import React, { Component } from 'react';
import { connect } from 'react-redux';

import Mblock from './block/Mblock';
import BaseBar from './BaseBar';

import '../../styles/Stack.css';

class Stack extends Component {

    constructor( props ) {

        super( props );

        this.state = {
            base: 'Decimal',
        }

        this.setBase = this.setBase.bind( this );
    }

    setBase( base ) {
        this.setState({ base: base });
    }

    render() {
        return (
            <div className="Stack">
                <h1>Stack</h1>
                <BaseBar setParentProps={this.setBase} />
                {
                    Object.keys( this.props.stack ).map( ( keys, index ) => {
                        return ( <Mblock addr={ keys }  key={index}
                            value={ this.props.stack[ keys ] } /> );
                    })
                }
                {
                    Object.keys( this.props.stack ).length == 0 &&
                    <h3>Stack is empty</h3>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.memory; // returns the stack object
}

export default connect( mapStateToProps )( Stack );