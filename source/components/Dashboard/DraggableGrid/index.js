import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import DraggableGridItem from '../DraggableGridItem';
import DragItem from '../DragItem';
import Styles from './styles.m.css';

@DragDropContext(HTML5Backend)
export default class DraggableGrid extends Component {
    static propTypes = {
        knightPosition: PropTypes.arrayOf(PropTypes.number.isRequired)
            .isRequired,
    };

    renderSquare(i) {
        const x = i % 8;
        const y = Math.floor(i / 8);

        return (
            <div key={ i } style={ { width: '12.5%', height: '12.5%' } }>
                <DraggableGridItem x={ x } y={ y }>
                    { this.renderPiece(x, y) }
                </DraggableGridItem>
            </div>
        );
    }

    renderPiece(x, y) {
        const [ knightX, knightY ] = this.props.knightPosition;
        const isKnightHere = x === knightX && y === knightY;

        return isKnightHere ? <DragItem /> : null;
    }

    render() {
        const squares = [];
        for (let i = 0; i < 64; i += 1) {
            squares.push(this.renderSquare(i));
        }

        return <div className={ Styles.grid }>{ squares }</div>;
    }
}
