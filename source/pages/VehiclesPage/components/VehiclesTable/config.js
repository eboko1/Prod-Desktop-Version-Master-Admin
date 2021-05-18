// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Icon, Popover, Button } from 'antd';
import _ from 'lodash';
import { v4 } from "uuid";

//Proj
import book from 'routes/book';
import { Numeral, StyledButton } from "commons";
import { permissions, isForbidden } from 'utils';

//Own
import Styles from './styles.m.css';


//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    vehicle: '20%',
    vehicleNumber: '10%',
    vehicleVin: '20%',
    client: 'auto',
}

/**
 * Creates specificly styled button with popup hint
 * @property onClick - event handler
 * @property user - user to make permissin validations for
 * @property popMessage - message to show when hovered
 * @returns Styled button with handler, popMessage and permisions setup
 */
const CreateOrderBtn = (props) => {
    const {
        onClick,
        user,
        popMessage
    } = props;

    const content = (<div>{popMessage}</div>);

    return (
        <Popover content={content}>
            <Button
                type='primary'
                onClick={onClick}
                disabled={ isForbidden(user, permissions.CREATE_ORDER) }
            >
                <Icon type="plus" className={Styles.newOrderIcon}/>
            </Button>
        </Popover>
    );
}

export function columnsConfig(props) {

    const {
        user,
        onCreateOrderForClient
    } = props;

    const vehicleCol = {
        title:     <FormattedMessage id='name' />,
        width:     defWidth.vehicle,
        key:       v4(),
        render: (val, vehicle) => {
            return (
                <div>{`${_.get(vehicle, 'make')} ${_.get(vehicle, 'model')}`}</div>
            );
        }
    };

    const vehicleNumberCol = {
        title:     <FormattedMessage id='name' />,
        width:     defWidth.vehicleNumber,
        align:     'center',
        dataIndex: 'number',
        key:       v4(),
        render: (number) => {
            return (
                <div>{number}</div>
            )
        }
    };
    
    const vehicleVINCol = {
        title:      <FormattedMessage id='add_order_form.phone' />,
        width:      defWidth.vehicleVin,
        dataIndex: 'vin',
        key:        v4(),
        render: (vin) => {
            return (
                <div>{vin}</div>
            );
        }
    };

    const clientCol = {
        title:      <FormattedMessage id='add_order_form.phone' />,
        width:      defWidth.client,
        dataIndex: 'client',
        key:        v4(),
        render: (client) => {
            return (
                <div>{`${_.get(client, 'name')} ${_.get(client, 'surname')}`}</div>
            );
        }
    };

   
    return [
        vehicleCol,
        vehicleNumberCol,
        vehicleVINCol,
        clientCol,
    ];
}