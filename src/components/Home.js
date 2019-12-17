import React, { Component } from 'react';

import Rcontainer from './Rcontainer';
import DevContainer from './DevContainer';
import Stack from './Stack';

import '../styles/Home.css';

class Home extends Component {
    
    render() {
        return (
            <div className="Home">
                <Rcontainer />
                <DevContainer />
                <Stack />
            </div>
        );
    }
}

export default Home;