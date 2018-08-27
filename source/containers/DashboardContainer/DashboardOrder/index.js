// vendor
import React, { Component } from 'react';
import Resizable from 're-resizable';

// proj
import { ordersStatus } from '../dashboardConfig';
// import book from 'routes/book';

// own
import DashboardOrderDragSource from './DashboardOrderDragSource';

export default class DashboardOrder extends Component {
    state = {
        resizing: false,
        height:   30,
    };
    // constructor(props) {
    //     super(props);
    //
    //     // this._resizableRef = React.createRef();
    // }

    // _getResizableRef = resizable => {
    //     this.resizableRef = resizable;
    // };
    componentDidMount() {
        this.setState({
            height: this.resizable.resizable.getBoundingClientRect().height,
        });
    }

    _setResizeOrderState = () =>
        this.setState({ resizing: !this.state.resizing });

    _resizeOrder = (event, direction, ref, delta) => {
        // step in 30 equal with dashboard ROW_HEIGHT / minutes in one hour
        const {
            options: { duration },
            id,
            dropOrder,
        } = this.props;
        // console.log('→ this.props', duration);
        // console.log('→ this.state.height', this.state.height);
        // console.log('→ _resizeOrder(delta.height)', delta.height);
        // console.log(
        //     '→ (this.state.height + delta.height) / 60',
        //     (this.state.height + delta.height) / 60,
        // );
        const resizedDuration = (this.state.height + delta.height) / 60;
        // console.log('→ resizedDuration', resizedDuration);

        this.setState({ height: this.state.height + delta.height });

        dropOrder({ duration: resizedDuration, id });
    };

    render() {
        const {
            history,
            isDragging,
            x,
            y,
            columns,
            rows,
            id,
            status,
            dashboardRef,
            options,
            // hideSourceOnDrag,
        } = this.props;

        const { resizing } = this.state;

        const resizableStyles = {
            gridRow:    `${x + 1} / span ${rows}`,
            gridColumn: `${y + 1} / span ${columns}`,
            border:     '1px solid white',
            background: ordersStatus(this.props.status),
        };

        const resizingStyles = {
            gridRow:    `${x + 1} / span ${rows}`,
            gridColumn: `${y + 1} / span ${columns}`,
            background: ordersStatus(this.props.status),
            opacity:    0.5,
            border:     '1px solid white',
            zIndex:     10,
        };

        return (
            <Resizable
                style={ resizing ? resizingStyles : resizableStyles }
                minWidth={ 0 }
                minHeight={ 30 }
                grid={ [ void 0, 30 ] }
                // size={ { width: 'auto' } }
                defaultSize={ { witdh: 'auto' } }
                enable={ {
                    top:         false,
                    right:       false,
                    bottom:      status !== 'success',
                    left:        false,
                    topRight:    false,
                    bottomRight: false,
                    bottomLeft:  false,
                    topLeft:     false,
                } }
                // size={ { width: this.state.width, height: this.state.height } }
                onResizeStart={ () => {
                    this._setResizeOrderState();
                    console.log(
                        '→ onResizeStart',
                        this.resizable.resizable.getBoundingClientRect(),
                    );
                    // console.log('→ this._resizableRef ', this._resizableRef);

                    // return { ...resizableStyles, zIndex: 1 };
                } }
                onResize={ () => console.log('→ onResize') }
                onResizeStop={ (event, direction, ref, delta) => {
                    this._setResizeOrderState();
                    this._resizeOrder(event, direction, ref, delta);
                } }
                // onResizeStop={ refToElement => {
                //     console.log('→ onResizeStop', refToElement);
                // } }
                ref={ c => {
                    this.resizable = c;
                } }
                bounds={ dashboardRef.current }
            >
                { /* <div ref={ this._resizableRef }> */ }
                <DashboardOrderDragSource { ...this.props } />
                { /* </div> */ }
            </Resizable>
        );
    }
}
