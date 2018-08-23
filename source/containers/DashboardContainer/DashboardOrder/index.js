// vendor
import React, { Component } from 'react';
import Resizable from 're-resizable';

// proj
import { ordersStatus } from '../dashboardConfig';
// import book from 'routes/book';

// own
import DashboardOrderDragSource from './DashboardOrderDragSource';

export default class DashboardOrder extends Component {
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

        const resizableStyles = {
            gridRow:    `${x + 1} / span ${rows}`,
            gridColumn: `${y + 1} / span ${columns}`,
            // position:   'absolute',
            margin:     1,
            background: ordersStatus(this.props.status),
            // background: 'rebeccapurple',
            // zIndex:     1,
        };

        return (
            <Resizable
                style={ resizableStyles }
                minWidth={ 0 }
                grid={ [ void 0, 30 ] }
                // size={ { width: 'auto' } }
                defaultSize={ { witdh: 'auto' } }
                enable={ {
                    top:         false,
                    right:       false,
                    bottom:      true,
                    left:        false,
                    topRight:    false,
                    bottomRight: false,
                    bottomLeft:  false,
                    topLeft:     false,
                } }
                axis='y'
                onResizeStart={ () => {
                    console.log('→ onResizeStart');

                    return { ...resizableStyles, zIndex: 1 };
                } }
                onResizeStop={ () => console.log('→ onResizeStop') }
            >
                <DashboardOrderDragSource { ...this.props } />
            </Resizable>
        );
    }
}
