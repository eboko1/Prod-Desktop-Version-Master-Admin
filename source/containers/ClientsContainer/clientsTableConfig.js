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

export function columnsConfig(sort, user, formatMessage, setInvite) {
    const { GET_CLIENTS_BASIC_INFORMATION, CREATE_INVITE_ORDER } = permissions;
    const isClientInformationForbidden = isForbidden(
        user,
        GET_CLIENTS_BASIC_INFORMATION,
    );
    const isInviteForbidden = isForbidden(user, CREATE_INVITE_ORDER);

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
            ) : (
                <>
                    { client.name } { client.surname }
                </>
            ),
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
        title:  <FormattedMessage id='clients-table.invitation' />,
        key:    'invite',
        width:  150,
        render: client => {
            if (!client.inviteId) {
                return (
                    <Button
                        disabled={ !client.vehicles.length || isInviteForbidden }
                        type='primary'
                        onClick={ () => setInvite(client) }
                    >
                        <FormattedMessage id='orders.invite' />
                    </Button>
                );
            }

            return (
                <Link
                    className={ Styles.lastOrderLink }
                    to={ `${book.order}/${client.inviteId}` }
                >
                    { client.inviteId }
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
                        onConfirm={() => console.info("deleted")} // eslint-disable-line
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

    return [
        client,
        phone,
        vehicles,
        lastOrder,
        orders,
        invitation,
        actions,
    ];
}
