import React, { Component } from 'react';

import Rblock from './Rblock';

import '../styles/Rcontainer.css';

class Rcontainer extends Component {    
    render() {
        return (
            <div className="Rcontainer">
                <div className="Rcontrol">
                    <button>Decimal</button>
                    <button>Binary</button>
                    <button>Hexidecimal</button>
                </div>
                <Rblock rName="r0" />
                <Rblock rName="r1" />
                <Rblock rName="r2" />
                <Rblock rName="r3" />
                <Rblock rName="r4" />
                <Rblock rName="r5" />
                <Rblock rName="r6" />
                <Rblock rName="r7" />
                <Rblock rName="r8" />
                <Rblock rName="r9" />
                <Rblock rName="r10" />
                <Rblock rName="fp" />
                <Rblock rName="ip" />
                <Rblock rName="sp" />
                <Rblock rName="lr" />
                <Rblock rName="pc" />
            </div>
        )
    }
}

export default Rcontainer;