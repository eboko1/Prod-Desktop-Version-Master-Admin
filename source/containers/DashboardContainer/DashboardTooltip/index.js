// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
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
            position,
        } = this.props;
        // console.log('→ Tooltip props', this.props);
        console.log('→ this.props', this.props);

        return position ? (
            <div
                className={ className }
                key={ id }
                data-order={ id }
                style={ {
                    display: position ? 'flex' : 'none',
                    top:     position.top,
                    left:    position.left,
                } }
                // style={ this.state.popupStyles }
            >
                { console.log('→ comment', comment) }
                { clientName ||
                clientPhone ||
                vehicleMakeName ||
                vehicleModelName ||
                comment ? 
                    <>
                        <div>
                            { clientName } { clientSurname }
                        </div>
                        {clientName !== clientPhone && <div>{ clientPhone }</div>}
                        <div>
                            { vehicleMakeName } { vehicleModelName } { vehicleYear }
                        </div>
                        {comment && (
                            <div>
                                <span style={ { color: 'var(--link)' } }>
                                    Коментарий:
                                </span>
                                <DashboardTooltipComment>
                                    { comment }
                                </DashboardTooltipComment>
                            </div>
                        )}
                    </>
                    : (
                        <FormattedMessage id='no_data' />
                    ) }
            </div>
        ) : null;
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
    ${'' /* display: ${props => !props.position ? 'flex' : 'none'}; */}
    ${
    '' /* top: ${props => props.position.top};
    left: ${props => props.position.left}; */
}
    ${
    '' /* top: ${props => props.position ? props.position.top : 0};
    left: ${props => props.position ? props.position.left : 0}; */
} ${
    '' /* display: ${props => props.visible ? 'none' : 'flex'}; */
} flex-direction: column;
    justify-content: space-around;
    max-height: 170px;
    overflow: hidden;
    padding: 5px 5px 10px 5px;
    position: absolute;
    width: 200px;
    word-break: break-all;
    z-index: 3000;
    transform: translate(35%, -30%);

    ${'' /* ${DashboardOrder}:hover & {
        display: flex;
    } */};
`;

export default DashboardTooltip;
