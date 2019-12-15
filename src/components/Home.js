import React, { Component } from 'react';

import Rcontainer from './Rcontainer';
import DevContainer from './DevContainer';

import '../styles/Home.css';

class Home extends Component {
    
    render() {
        return (
            <div className="Home">
                <Rcontainer />
                <DevContainer />
            </div>
        );
    }
}

export default Home;