// vendor
import React, { Component } from 'react';
// import { findDOMNode } from 'react-dom';
import styled from 'styled-components';

// own
import DashboardOrder from '../DashboardOrder';

class TooltipBox extends Component {
    render() {
        const {
            id,
            clientName,
            clientSurname,
            clientPhone,
            vehicleMakeName,
            vehicleModelName,
            vehicleYear,
            comment,
            className,
        } = this.props;
        // console.log('→ TooltipBox this.props', this.props);

        return (
            <div
                className={ className }
                key={ id }
                data-order={ id }
                // style={ this.state.popupStyles }
            >
                <div>
                    { clientName } { clientSurname }
                </div>
                <div>{ clientPhone }</div>
                <div>
                    { vehicleMakeName } { vehicleModelName } { vehicleYear }
                </div>
                { comment && (
                    <div>
                        <span style={ { color: 'var(--link)' } }>
                            Коментарий:
                        </span>
                        <DashboardTooltipComment>
                            { comment }
                        </DashboardTooltipComment>
                    </div>
                ) }
            </div>
        );
    }
}

const DashboardTooltipComment = styled.div`
    border: 1px var(--link) solid;
    padding: 2px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
`;

const DashboardTooltip = styled(TooltipBox)`
    background: var(--paletteColor7);
    border: 1px solid var(--link);
    box-sizing: border-box;
    color: #fff;
    display: none;
    ${'' /* display: ${props => props.visible ? 'none' : 'flex'}; */} flex-direction: column;
    justify-content: space-around;
    max-height: 200px;
    overflow: hidden;
    padding: 5px 5px 10px 5px;
    position: absolute;
    width: 200px;
    word-break: break-all;
    z-index: 3000;
    transform: translate(35%, -30%);

    ${DashboardOrder}:hover & {
        display: flex;
    }
`;

export default DashboardTooltip;
