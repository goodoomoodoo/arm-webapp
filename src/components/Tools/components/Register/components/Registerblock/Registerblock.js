import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Registerblock.css';

class Registerblock extends Component {

    render() {
        return (
            <div className="Registerblock">

                <div>{ this.props.rName }</div>
                <Block
                    base={this.props.base}
                    name={this.props.rName}
                    register={this.props.register} />
            </div>
        );
    }
}

const Block = props => {

    let base = props.base;
    let register = props.register;
    let name = props.name;

    if (base === 'Decimal')
        return (
            <div className="Registerblock-val">
                        {register[name].toString()}
            </div>
        );
    else if (base === 'Hexademical')
        return (
            <div className="Registerblock-val">
                        {register[name].toString(16)}
            </div>
        );
    else
        return (
            <div className="Registerblock-val">
                        {register[name].toString(2)}
            </div>
        );  
}

const mapStateToProps = state => {
    return { register: state.register };
}

export default connect( mapStateToProps )( Registerblock );