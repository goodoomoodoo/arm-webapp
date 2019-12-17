import React, { Component } from 'react';
import { connect } from 'react-redux';

import Mblock from './Mblock';

class Stack extends Component {
    render() {
        return (
            <div>
                Stack
                {
                    Object.keys( this.props.stack ).map( ( keys, index ) => {
                        return ( <Mblock addr={ keys }  key={index}
                            value={ this.props.stack[ keys ] } /> );
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.memory; // returns the stack object
}

export default connect( mapStateToProps )( Stack );