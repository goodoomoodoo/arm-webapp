import React, { Component } from 'react';

import './Navbar.css';

class Navbar extends Component {

    constructor(props) {

        super(props);

        this.state = {
            selectedState: 'Register'
        };

        this.handleStateChange = this.handleStateChange.bind(this);
    }

    handleStateChange(e) {
        this.setState({
            selectedState: e.target.name
        });

        this.props.changeState(e.target.name);
    }

    render() {
        return (
            <div className='Navbar'>
                <button 
                    name='Register'
                    className={
                        this.state.selectedState === 'Register'
                        ? 'selected'
                        : 'unselected'
                    }
                    onClick={this.handleStateChange}>
                        Register
                </button>

                <button 
                    name='Memory'
                    className={
                        this.state.selectedState === 'Memory'
                        ? 'selected'
                        : 'unselected'
                    }
                    onClick={this.handleStateChange}>Memory</button>
            </div>
        );
    }
}

export default Navbar;