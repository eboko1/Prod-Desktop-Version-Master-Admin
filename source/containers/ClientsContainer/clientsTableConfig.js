// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Icon, Tooltip, Button } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

// proj
import { OrderStatusIcon, Numeral } from 'components';
import book from 'routes/book';
import { permissions, isForbidden } from 'utils';
// own
import Styles from './styles.m.css';

export function columnsConfig(
    invited,
    action,
    isOrderInvitable,
    isAlreadyInvited,
    activeRoute,
    sort,
    user,
) {
    const sortOptions = {
        asc:  'ascend',
        desc: 'descend',
    };

    const client = {
        title:     'Client',
        width:     220,
        dataIndex: 'name',
        key:       'name',
        // fixed:     'left',
        render:    (_, client) => (
            <Link
                className={ Styles.client }
                to={ `${book.clients}/${client.clientId}` }
            >
                { client.name } { client.surname }
            </Link>
        ),
    };

    const phone = {
        title:     'Phone',
        width:     200,
        dataIndex: 'phones',
        key:       'phones',
        render:    phones => (
            <a className={ Styles.phone } href={ `tel:${phones[ 0 ]}` }>
                { phones[ 0 ] }
            </a>
        ),
    };

    const vehicles = {
        title:     'Vehicles',
        width:     400,
        dataIndex: 'vehicles',
        key:       'vehicles',
        render:    (data, client) =>
            client.vehicles.length > 0
                ? client.vehicles.map(vehicle => (
                    <div className={ Styles.vehicle } key={ vehicle.id }>
                        { vehicle.number ? (
                            <span className={ Styles.vehicleNum }>
                                { `${vehicle.number} -` }
                            </span>
                        ) : (
                            <span className={ Styles.vehicleNum }>-</span>
                        ) }
                        <span>
                            { vehicle.make } { vehicle.model }{ ' ' }
                            { vehicle.modification } ({ vehicle.year })
                        </span>
                    </div>
                ))
                : null,
    };

    const lastOrder = {
        title:     'Last Order',
        width:     140,
        dataIndex: 'lastOrderId',
        key:       'lastOrderId',
        render:    (data, order) => (
            <div className={ Styles.lastOrder }>
                { order.lastOrderBeginDatetime
                    ? moment(order.lastOrderBeginDatetime).format('YYYY-MM-DD')
                    : null }{ ' ' }
                <Link
                    className={ Styles.lastOrderLink }
                    to={ `${book.order}/${order.lastOrderId}` }
                >
                    { order.lastOrderId }
                </Link>
            </div>
        ),
    };

    const orders = {
        title:     'Orders',
        width:     100,
        // sorter:    true,
        // sortOrder: sort.field === 'totalSum' ? sortOptions[ sort.order ] : false,
        dataIndex: 'orders',
        key:       'orders',
        render:    orders =>
            orders && <div className={ Styles.orders }>{ orders }</div>,
    };

    const invitation = {
        title:     <FormattedMessage id='orders.invitation' />,
        dataIndex: 'invite',
        key:       'invite',
        width:     150,
        render:    (_void, order) => {
            if (!order.vehicleInviteExists) {
                return (
                    <Button
                        type='primary'
                        onClick={ () => action([ order ]) }
                        // disabled={ isInviteButtonDisabled(order) }
                    >
                        <FormattedMessage id='orders.invite' />
                    </Button>
                );
            }

            return (
                <Link
                // to={ `${book.order}/${order.vehicleInviteExists}` }
                >
                    { /* { order.vehicleInviteExists } */ }
                </Link>
            );
        },
    };

    const actions = {
        title:  '',
        key:    'actions',
        // fixed:  'right',
        width:  'auto',
        render: (_, client) => (
            <div className={ Styles.actions }>
                <Link to={ `${book.clients}/${client.clientId}` }>
                    <Icon className={ Styles.editClientIcon } type='edit' />
                </Link>
                <div className={ Styles.actionsLine } />
                <Icon
                    onClick={ () => console.log('→ delete') }
                    className={ Styles.deleteClientIcon }
                    type='delete'
                />
            </div>
        ),
    };

    return [ client, phone, vehicles, lastOrder, orders, invitation, actions ];
}

export const rowsConfig = (selectedRowKeys, onChange, getCheckboxProps) => ({
    selectedRowKeys,
    onChange,
    getCheckboxProps,
});
