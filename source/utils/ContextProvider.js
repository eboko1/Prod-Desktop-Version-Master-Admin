import React, { Component } from 'react';

const Context = React.createContext();

export class ContextProvider extends Component {
    state = {};

    render() {
        return (
            <Context.Provider value={ this.state }>
                { this.props.children }
            </Context.Provider>
        );
    }
}