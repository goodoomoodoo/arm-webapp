import React, { Component } from 'react';

import '../../../styles/Rblock.css';

class Mblock extends Component {
    render() {
        return (
             <div className="Rblock">

                <div>{ this.props.addr.toString( 16 ) }</div>
                <div className="Rblock-val">
                    { 
                        this.props.base === 'Decimal' &&
                        this.props.value.toString() 
                    }
                    { 
                        this.props.base === 'Hexadecimal' &&
                        (this.props.value >>> 0).toString( 16 ) 
                    }
                    { 
                        this.props.base === 'Binary' &&
                        (this.props.value >>> 0).toString( 2 ) 
                    }
                </div>
            </div>
        );
    }
}

export default Mblock;