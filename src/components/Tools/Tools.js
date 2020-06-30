import React, {Component} from 'react';

import Register from './components/Register/index';
import Memory from './components/Memory/index';
import Console from './components/Console/index';

import Navbar from './components/Navbar/index';

import './Tools.css';

class Tools extends Component {

    constructor(props) {
        
        super(props);

        this.state = {
            selectedState: 'Register'
        }

        this.changeState = this.changeState.bind(this);
    }

    /**
     * Change Register/Memory state
     * @param {String} state 
     */
    changeState(state) {
        this.setState({
            selectedState: state
        });
    }

    render() {
        return (
            <div className="Tools">
                <Navbar changeState={this.changeState} />
                <Window state={this.state.selectedState} />
                <Console />
            </div>
        );
    }

}

const Window = props => {

    let state = props.state;

    if (state === 'Register')
        return <Register />;
    else
        return <Memory />;
}

export default Tools;