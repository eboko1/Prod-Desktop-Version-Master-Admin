// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

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

        return position ? (
            <div
                className={ className }
                key={ id }
                data-order={ id }
                style={ {
                    display: position ? 'flex' : 'flex',
                    top:     position.top,
                    left:    position.left,
                } }
                // style={ this.state.popupStyles }
            >
                { clientName ||
                clientPhone ||
                vehicleMakeName ||
                vehicleModelName ||
                comment ? 
                    <>
                        <DashboardTooltipClient>
                            { clientName } { clientSurname }
                        </DashboardTooltipClient>
                        {clientName !== clientPhone && <div>{ clientPhone }</div>}
                        <DashboardTooltipVehicle>
                            { vehicleMakeName } { vehicleModelName } { vehicleYear }
                        </DashboardTooltipVehicle>
                        {comment && (
                            <div>
                                <span style={ { color: 'red' } }>
                                    <FormattedMessage id='comment' />:
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

const DashboardTooltipClient = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const DashboardTooltipVehicle = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const DashboardTooltipComment = styled.div`
    border: 1px var(--link) solid;
    padding: 2px;
    overflow: hidden;
    display: -webkit-box;
    word-break: normal;
    white-space: pre-wrap;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
`;

const DashboardTooltip = styled(TooltipBox)`
    background-color: rgb(255, 255, 205);
    border: 1px solid var(--link);
    box-sizing: border-box;
    color: black;
    flex-direction: column;
    justify-content: space-around;
    max-height: 170px;
    overflow: hidden;
    padding: 5px 5px 10px 5px;
    position: absolute;
    width: 200px;
    word-break: break-all;
    z-index: 3000;
    transition: 0.3s all ease-in-out;
    transform: translateX(35%) translateY(calc(-20% - 0.5px)) translateZ(0);
    translate3d: (0, 0, 0);
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    backface-visibility: hidden;
    /* font-weight: bold; */
    -webkit-font-smoothing: antialiased;

    ${'' /* ${DashboardOrder}:hover & {
        display: flex;
    } ; */};
`;

export default DashboardTooltip;
