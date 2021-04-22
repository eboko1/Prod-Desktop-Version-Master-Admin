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
    client_full_name: '15%',
    actions: '5%',
    client_phones: '20%',
    client_vehicles: 'auto',
    client_debts: '8%',
    vehicle_vin: '15%'
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
                <CreateOrderBtn
                    onClick={() => onCreateOrderForClient({clientId: client.clientId})}
                    user={user}
                    popMessage={<FormattedMessage id="client_hot_operations_page.hint_create_order_with_cient"/>}
                />
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
        title:     <FormattedMessage id='client_hot_operations_page.debt' />,
        width:     defWidth.client_debts,
        dataIndex: 'totalDebtWithTaxes',
        key:       'totalDebtWithTaxes',
        render:    (totalDebtWithTaxes, client) => {
            
            const debt = totalDebtWithTaxes ? totalDebtWithTaxes : 0;

            const debtText = (
                <Numeral
                    className={Styles.debt}
                    nullText='0'
                    mask='0,0.00'
                >
                    {debt}
                </Numeral>
            );

            return !isForbidden(user, permissions.GET_CLIENTS_BASIC_INFORMATION) ? (
                <Link
                    to={{
                        pathname: `${book.client}/${client.clientId}`,
                        state:{
                            specificTab: 'clientDebt'
                        },
                    }}
                >
                    {debtText}
                </Link>
            ) : debtText
        },
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
                            <CreateOrderBtn
                                onClick={() => onCreateOrderForClient({clientId: client.clientId, vehicleId: vehicle.id})}
                                user={user}
                                popMessage={<FormattedMessage id="client_hot_operations_page.hint_create_order_with_cient_and_vehicle"/>}
                            />
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