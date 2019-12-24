import React, { Component } from 'react';

import Rblock from './block/Rblock';
import BaseBar from './BaseBar';

import '../../styles/Rcontainer.css';

class Rcontainer extends Component { 
    
    constructor( props ) {

        super( props );

        this.state = {
            base: 'Decimal'
        }

        this.setBase = this.setBase.bind( this );
    }

    setBase( base ) {
        this.setState({ base: base });
    }

    render() {
        
        return (
            <div className="Rcontainer">
                <h1>Register</h1>
                <BaseBar setParentProps={this.setBase} />
                <Rblock base={this.state.base} rName="r0" />
                <Rblock base={this.state.base} rName="r1" />
                <Rblock base={this.state.base} rName="r2" />
                <Rblock base={this.state.base} rName="r3" />
                <Rblock base={this.state.base} rName="r4" />
                <Rblock base={this.state.base} rName="r5" />
                <Rblock base={this.state.base} rName="r6" />
                <Rblock base={this.state.base} rName="r7" />
                <Rblock base={this.state.base} rName="r8" />
                <Rblock base={this.state.base} rName="r9" />
                <Rblock base={this.state.base} rName="r10" />
                <Rblock base={this.state.base} rName="fp" />
                <Rblock base={this.state.base} rName="ip" />
                <Rblock base={this.state.base} rName="sp" />
                <Rblock base={this.state.base} rName="lr" />
                <Rblock base={this.state.base} rName="pc" />
            </div>
        )
    }
}

export default Rcontainer;