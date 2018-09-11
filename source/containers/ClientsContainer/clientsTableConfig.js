// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Icon, Popconfirm, Button } from 'antd';
import moment from 'moment';

// proj
import { Numeral } from 'commons';
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
    formatMessage,
) {
    const sortOptions = {
        asc:  'ascend',
        desc: 'descend',
    };

    const { GET_CLIENTS_BASIC_INFORMATION } = permissions;
    const isClientInformationForbidden = isForbidden(
        user,
        GET_CLIENTS_BASIC_INFORMATION,
    );

    const client = {
        title:     <FormattedMessage id='clients-table.client' />,
        width:     220,
        dataIndex: 'name',
        key:       'name',
        // fixed:     'left',
        render:    (_, client) =>
            !isForbidden(user, permissions.GET_CLIENTS_BASIC_INFORMATION) ? (
                <Link
                    className={ Styles.client }
                    to={ `${book.client}/${client.clientId}` }
                >
                    { client.name } { client.surname }
                </Link>
            ) : 
                <>
                    {client.name} {client.surname}
                </>
        ,
    };

    const phone = {
        title:     <FormattedMessage id='clients-table.phone' />,
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
        title:     <FormattedMessage id='clients-table.vehicles' />,
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
        title:     <FormattedMessage id='clients-table.last_order' />,
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
        title:     <FormattedMessage id='clients-table.orders' />,
        width:     100,
        // sorter:    true,
        // sortOrder: sort.field === 'totalSum' ? sortOptions[ sort.order ] : false,
        dataIndex: 'orders',
        key:       'orders',
        render:    orders =>
            orders && <Numeral className={ Styles.orders }>{ orders }</Numeral>,
    };

    const invitation = {
        title:     <FormattedMessage id='clients-table.invitation' />,
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
                { !isClientInformationForbidden ? (
                    <Link to={ `${book.client}/${client.clientId}` }>
                        <Icon className={ Styles.editClientIcon } type='edit' />
                    </Link>
                ) : null }
                <div className={ Styles.actionsLine } />
                { !isForbidden(user, permissions.CREATE_EDIT_DELETE_CLIENTS) ? (
                    <Popconfirm
                        cancelText={ formatMessage({ id: 'no' }) }
                        okText={ formatMessage({ id: 'yes' }) }
                        title={ `${formatMessage({ id: 'delete' })}?` }
                        onConfirm={ () => console.log('→ deleted') }
                    >
                        <Icon
                            className={ Styles.deleteClientIcon }
                            type='delete'
                        />
                    </Popconfirm>
                ) : null }
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
