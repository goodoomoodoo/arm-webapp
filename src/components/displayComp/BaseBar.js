import React, { Component } from 'react';

import '../../styles/BaseBar.css';

class BaseBar extends Component {

    constructor( props ) {
        
        super( props );

        this.state = {
            selected: "Decimal"
        }

        this.handleSelect = this.handleSelect.bind( this );
    }

    handleSelect( e ) {
        this.setState({ selected: e.target.name });
        this.props.setParentProps( e.target.name );
    }

    render() {
        return (
            <div className="BaseBar">
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
        );
    }
}

export default BaseBar;