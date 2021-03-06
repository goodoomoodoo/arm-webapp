import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../../../styles/Rblock.css';

class Rblock extends Component {

    render() {
        return (
            <div className="Rblock">

                <div>{ this.props.rName }</div>
                <div className="Rblock-val">
                    { 
                        this.props.base === 'Decimal' &&
                        this.props.register[ this.props.rName ].toString() 
                    }
                    { 
                        this.props.base === 'Hexadecimal' &&
                        this.props.register[ this.props.rName ].toString( 16 ) 
                    }
                    { 
                        this.props.base === 'Binary' &&
                        (this.props.register[ this.props.rName ] >>> 0).toString( 2 ) 
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { register: state.register };
}

export default connect( mapStateToProps )( Rblock );