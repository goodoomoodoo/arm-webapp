import React, { Component } from 'react';
import { connect } from 'react-redux';

import Memoryblock from './components/Memoryblock/index';

import './Memory.css';

class Memory extends Component {

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
            <div className="Memory">
                
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { stack: state.stack }; // returns the stack object
}

export default connect( mapStateToProps )( Memory );