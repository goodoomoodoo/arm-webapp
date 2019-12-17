import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../styles/Rblock.css';

class Rblock extends Component {

    constructor( props ) {
        
        super( props );
 
    }

    render() {
        return (
            <div className="Rblock">

                <span>{ this.props.rName }</span>
                <span className="Rblock-val">
                    { this.props[ this.props.rName ] }
                </span>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return state.register;
}

export default connect( mapStateToProps )( Rblock );