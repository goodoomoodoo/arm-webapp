import React from 'react';

class Mblock extends React.Component {
    render() {
        return (
            <div>
                <span>{ this.props.addr } </span>
                <span>{ this.props.value }</span>
            </div>
        );
    }
}

export default Mblock;