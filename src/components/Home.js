import React, { Component } from 'react';

import Rcontainer from './displayComp/Rcontainer';
import DevContainer from './devComp/DevContainer';
import Stack from './displayComp/Stack';
import Log from './Log';

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
                <Log />
            </div>
        );
    }
}

export default Home;