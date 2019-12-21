import React, { Component } from 'react';

import Rblock from './Rblock';

import '../styles/Rcontainer.css';

class Rcontainer extends Component { 
    
    constructor( props ) {

        super( props );

        this.state = {
            selected: 'Decimal'
        }

        this.handleSelect = this.handleSelect.bind( this );
    }

    handleSelect( e ) {
        this.setState({ selected: e.target.name });
    }

    render() {
        
        return (
            <div className="Rcontainer">
                <div className="Rcontrol">
                    <button
                        name="Decimal"
                        className={
                            this.state.selected === 'Decimal' ?
                            'selected' : 'unselected'
                        }
                        onClick={this.handleSelect}>Decimal</button>
                    <button
                        name="Binary"
                        className={
                            this.state.selected === 'Binary' ?
                            'selected' : 'unselected'
                        }
                        onClick={this.handleSelect}>Binary</button>
                    <button
                        name="Hexadecimal"
                        className={
                            this.state.selected === 'Hexadecimal' ?
                            'selected' : 'unselected'
                        }
                        onClick={this.handleSelect}>Hexadecimal</button>
                </div>
                <Rblock base={this.state.selected} rName="r0" />
                <Rblock base={this.state.selected} rName="r1" />
                <Rblock base={this.state.selected} rName="r2" />
                <Rblock base={this.state.selected} rName="r3" />
                <Rblock base={this.state.selected} rName="r4" />
                <Rblock base={this.state.selected} rName="r5" />
                <Rblock base={this.state.selected} rName="r6" />
                <Rblock base={this.state.selected} rName="r7" />
                <Rblock base={this.state.selected} rName="r8" />
                <Rblock base={this.state.selected} rName="r9" />
                <Rblock base={this.state.selected} rName="r10" />
                <Rblock base={this.state.selected} rName="fp" />
                <Rblock base={this.state.selected} rName="ip" />
                <Rblock base={this.state.selected} rName="sp" />
                <Rblock base={this.state.selected} rName="lr" />
                <Rblock base={this.state.selected} rName="pc" />
            </div>
        )
    }
}

export default Rcontainer;