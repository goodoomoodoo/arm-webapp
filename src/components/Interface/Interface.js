import React, { Component } from 'react';

import Editor from '../Editor/index';
import Tools from '../Tools/index';

import './Interface.css';

class Interface extends Component {
    
    render() {
        return (
            <div className="Interface">
                <Editor />
                <Tools />
            </div>
        );
    }
}

export default Interface;