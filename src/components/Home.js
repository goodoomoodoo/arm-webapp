import React, { Component } from 'react';

import Rcontainer from './Rcontainer';
import DevContainer from './DevContainer';
import Stack from './Stack';

import '../styles/Home.css';

class Home extends Component {
    
    render() {
        return (
            <div className="Home">
                <DevContainer />
                <div>
                    <Rcontainer />
                    <Stack />
                </div>
            </div>
        );
    }
}

export default Home;