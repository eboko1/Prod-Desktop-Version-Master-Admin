// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import _ from 'lodash';
import { v4 } from "uuid";

//Proj
import book from 'routes/book';

//Own
import Styles from './styles.m.css';


//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    client_full_name: '15%',
    actions: '10%',
    client_phones: '20%',
    client_vehicles: 'auto',
    vehicle_vin: '20%'
}

/* eslint-disable complexity */
export function columnsConfig(props) {

    const {
        onCreateOrderForClient
    } = props;

    const clientFullNameCol = {
        title:     <FormattedMessage id='name' />,
        width:     defWidth.client_full_name,
        key:       v4(),
        render: (val, obj) => {
            return (
                <Link
                    className={ Styles.clientLink }
                    to={ `${book.client}/${obj.clientId}` }
                >
                    { `${obj.name || ""} ${obj.surname || ""}` }
                </Link>
            );
        }
    };

    const actionsCol = {
        width: defWidth.actions,
        render: (val, client) => {
            return (<Button onClick={() => onCreateOrderForClient({clientId: client.clientId})}>
                <FormattedMessage id={"client_hot_operations_page.create_new_order"} />
            </Button>)
        }
    };
    
    const phonesCol = {
        title:      <FormattedMessage id='add_order_form.phone' />,
        width:      defWidth.client_phones,
        dataIndex:  'phones',
        key:        'phones',
        render: (phones) => {
            return (
                phones.map(phone => (
                    <a
                        className={ Styles.clientPhone }
                        href={ `tel:${phone}` }
                        key={v4()}
                    >
                        { phone }
                    </a>
                ))
                
            );
        }
    };

    const vehicleCol = {
        title:      <FormattedMessage id='vehicle' />,
        width:      defWidth.client_vehicles,
        key:        'vehicle',
        render: client => {
            const vehicle = _.get(client, 'vehicles[0]');
            if (!vehicle) {
                return '';
            }

            return vehicle.model
                ? `${vehicle.make} ${vehicle.model} (${vehicle.year})`
                : '';
        },
    };

    const vinCol = {
        title:      <FormattedMessage id='add_order_form.vin' />,
        width:      defWidth.vehicle_vin,
        key:        'vin',
        render: client => {
            const vehicle = _.get(client, 'vehicles[0]');
            if (!vehicle) {
                return '';
            }

            const vin = vehicle.vin || '';

            return vehicle.number
                ? vehicle.number + ' ' + vin
                : vehicle.vin;
        },
    };

    return [
        clientFullNameCol,
        actionsCol,
        phonesCol,
        vehicleCol,
        vinCol
    ];
}