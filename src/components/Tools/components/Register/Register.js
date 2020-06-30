import React, { Component } from 'react';

import Registerblock from './components/Registerblock/index';

import './Register.css'

class Register extends Component { 
    
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
            <div className="Register">
                <Registerblock base={this.state.base} rName="r0" />
                <Registerblock base={this.state.base} rName="r8" />
                <Registerblock base={this.state.base} rName="r1" />
                <Registerblock base={this.state.base} rName="r9" />
                <Registerblock base={this.state.base} rName="r2" />
                <Registerblock base={this.state.base} rName="r10" />
                <Registerblock base={this.state.base} rName="r3" />
                <Registerblock base={this.state.base} rName="fp" />
                <Registerblock base={this.state.base} rName="r4" />
                <Registerblock base={this.state.base} rName="ip" />
                <Registerblock base={this.state.base} rName="r5" />
                <Registerblock base={this.state.base} rName="sp" />
                <Registerblock base={this.state.base} rName="r6" />
                <Registerblock base={this.state.base} rName="lr" />
                <Registerblock base={this.state.base} rName="r7" />
                <Registerblock base={this.state.base} rName="pc" />
            </div>
        )
    }
}

export default Register;