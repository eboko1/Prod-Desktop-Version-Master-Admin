// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from 'antd';
import _ from 'lodash';
import { v4 } from "uuid";

//Proj
import book from 'routes/book';
import { Numeral, StyledButton } from "commons";

//Own
import Styles from './styles.m.css';


//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    client_full_name: '15%',
    actions: '5%',
    client_phones: '20%',
    client_vehicles: 'auto',
    client_debts: '10%',
    vehicle_vin: '15%'
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
        align: 'center',
        render: (val, client) => {
            return (
                <StyledButton type='primary' onClick={() => onCreateOrderForClient({clientId: client.clientId})}>
                    <Icon type="plus" className={Styles.newOrderIcon}/>
                </StyledButton>
            )
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

    const debtsCol = {
        title:      <FormattedMessage id='client_hot_operations_page.debt' />,
        width:      defWidth.client_debts,
        dataIndex:  'totalDebtWithTaxes',
        key:        'totalDebtWithTaxes',
        render: (debt) => {
            return (
                <Numeral
                    nullText='0'
                    mask='0,0.00'
                >
                    { debt }
                </Numeral>
            );
        }
    };

    const vehicleCol = {
        title:      <FormattedMessage id='vehicle' />,
        width:      defWidth.client_vehicles,
        key:        'vehicle',
        render: client => {
            const vehicles = _.get(client, 'vehicles');
            return vehicles
                ? (_.map(vehicles, (vehicle) => {
                    if(!vehicle.model) return "";

                    return (
                        <div key={v4()} className={Styles.vehicle}>
                            <span>{`${vehicle.make} ${vehicle.model} (${vehicle.year})`}</span>
                            <StyledButton type='primary' onClick={() => onCreateOrderForClient({clientId: client.clientId, vehicleId: vehicle.id})}>
                                <Icon type="plus" className={Styles.newOrderIcon}/>
                            </StyledButton>
                        </div>
                    );
                }))
                :"---";
        },
    };

    const vinCol = {
        title:      <FormattedMessage id='add_order_form.vin' />,
        width:      defWidth.vehicle_vin,
        key:        'vin',
        render: client => {
            const vehicles = _.get(client, 'vehicles');
            return vehicles
                ? (_.map(vehicles, (vehicle) => {
                    if(!vehicle.model) return "";

                    const vehicleVin = vehicle.vin || '';
                    const vehicleNumber = vehicle.number || '';

                    return (
                        <div key={v4()} className={Styles.vin}>
                            <div>{`${vehicleNumber + ' ' + vehicleVin}`}</div>
                        </div>
                    );
                }))
                :"---";
            }
    };

    return [
        clientFullNameCol,
        actionsCol,
        phonesCol,
        debtsCol,
        vehicleCol,
        vinCol
    ];
}