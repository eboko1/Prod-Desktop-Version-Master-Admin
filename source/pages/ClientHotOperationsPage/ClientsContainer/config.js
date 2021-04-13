// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { v4 } from "uuid";

//Proj
import book from 'routes/book';

//Own
import Styles from './styles.m.css';


//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    no: '4%',
    client_vehicle: '10%',
    client_name: 'auto',

    order_planner: '6%',
    order_labors_plan: '6%',
    order_labors_actual: '6%',
    order_breaks: '6%',
    
    location_internal_parking: '6%',
    location_external_parking: '6%',
    location_department: '6%',
    location_test_drive: '6%',
    location_total: '6%',

    efficiency_plan: '6%',
    efficiency_department: '6%',
    efficiency_station: '6%'
}

/* eslint-disable complexity */
export function columnsConfig() {

    const clientFullNameCol = {
        title:     <FormattedMessage id='name' />,
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
    
    const phonesCol = {
        title:     <FormattedMessage id='add_order_form.phone' />,
        dataIndex: 'phones',
        key:       'phones',
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
        title:  <FormattedMessage id='vehicle' />,
        key:    'vehicle',
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
        title:  <FormattedMessage id='add_order_form.vin' />,
        key:    'vin',
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
        phonesCol,
        vehicleCol,
        vinCol
    ];
}