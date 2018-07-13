import React, { Component } from 'react';

import DraggableGrid from './DraggableGrid';

import { observe } from './Game';

/**
 * Unlike the tutorial, export a component so it can be used on the website.
 */
export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.unobserve = observe(this.handleChange.bind(this));
    }

    handleChange(knightPosition) {
        const nextState = { knightPosition };
        if (this.state) {
            this.setState(nextState);
        } else {
            this.state = nextState;
        }
    }

    componentWillUnmount() {
        this.unobserve();
    }

    render() {
        const { knightPosition } = this.state;

        return (
            <div>
                <a href='https://github.com/react-dnd/react-dnd/tree/master/packages/documentation/examples/00%20ChessDraggableGrid/Tutorial%20App'>
                    Browse the Source
                </a>

                <div
                    style={ {
                        width:  500,
                        height: 500,
                        border: '1px solid gray',
                    } }
                >
                    <DraggableGrid knightPosition={ knightPosition } />
                </div>
            </div>
        );
    }
}
