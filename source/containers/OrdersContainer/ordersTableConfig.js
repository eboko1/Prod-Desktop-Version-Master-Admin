// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Icon, Tooltip, Button } from 'antd';
import classNames from 'classnames/bind';
import moment from 'moment';
import _ from 'lodash';

// proj
import { Numeral } from 'commons';
import { OrderStatusIcon, RepairMapIndicator } from 'components';
import { permissions, isForbidden } from 'utils';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    index_col: '4%',
    order_col: '15%',

    datetime_col: '10%',
    begin_datetime_col: '10%',
    delivery_datetime_col: '10%',
    success_datetime_col: '10%',
    create_datetime_col: '10%',

    client_col: '30%',
    sum_col: '8%',
    remaining_sum_col: '8%',

    responsible_col: '10%',
    source_col: '8%',
    tasks_col: '8%',
    review_col: '10%',
    invitation_col: '10%',

    action_col: '8%',
    edit_col: '10%'
}

/* eslint-disable complexity */
export function columnsConfig(
    invited,
    action,
    isOrderInvitable,
    isAlreadyInvited,
    activeRoute,
    sort,
    user,
    formatMessage,
    isMobile,
) {
    const sortOptions = {
        asc:  'ascend',
        desc: 'descend',
    };

    const indexCol = {
        title:     '№',
        width:     defWidth.index_col,
        dataIndex: 'index',
        key:       'index',
    };

    const orderCol = {
        title:     <FormattedMessage id='orders.order' />,
        width:     defWidth.order_col,
        dataIndex: 'num',
        key:       'num',
        render:    (_, order) => (
            <>
                <Link
                    className={ Styles.ordernLink }
                    to={ `${book.order}/${order.id}` }
                >
                    { order.num }
                </Link>
                <OrderStatusIcon status={ order.status } />
                { order.serviceNames && (
                    <div className={ Styles.serviceNames }>
                        { [ ...new Set(order.serviceNames) ].join(', ') }
                    </div>
                ) }
                { order.recommendation && (
                    <div className={ Styles.recommendation }>
                        { order.recommendation }
                    </div>
                ) }
                { (order.cancelReason ||
                    order.cancelStatusReason ||
                    order.cancelStatusOwnReason) && (
                    <div className={ Styles.cancelReason }>
                        { /* <div>{ order.cancelReason }</div> */ }
                        <div>{ order.cancelStatusReason }</div>
                        <div>{ order.cancelStatusOwnReason }</div>
                    </div>
                ) }
                <RepairMapIndicator data={order.repairMapIndicator}/>
            </>
        ),
    };

    const datetimeCol = {
        title:     <FormattedMessage id='orders.creation_date' />,
        width:     defWidth.datetime_col,
        dataIndex: 'datetime',
        key:       'datetime',
        sorter:    true,
        sortOrder: sort.field === 'datetime' ? sortOptions[ sort.order ] : false,
        render:    (_, order) => (
            <div className={ Styles.datetime }>
                { order.datetime
                    ? moment(order.datetime).format('DD.MM.YYYY HH:mm')
                    : '-' }
            </div>
        ),
    };

    const beginDatetimeCol = {
        title:     <FormattedMessage id='orders.begin_date' />,
        width:     defWidth.begin_datetime_col,
        dataIndex: 'beginDatetime',
        key:       'beginDatetime',
        sortOrder:
            sort.field === 'beginDatetime' ? sortOptions[ sort.order ] : false,
        sorter: true,
        render: (_, order) => (
            <div className={ Styles.datetime }>
                { order.beginDatetime
                    ? moment(order.beginDatetime).format('DD.MM.YYYY HH:mm')
                    : '-' }
            </div>
        ),
    };

    const deliveryDatetimeCol = {
        title:     <FormattedMessage id='orders.delivery_date' />,
        width:     defWidth.delivery_datetime_col,
        dataIndex: 'deliveryDatetime',
        key:       'deliveryDatetime',
        sortOrder:
            sort.field === 'deliveryDatetime' ? sortOptions[ sort.order ] : false,
        sorter: true,
        render: (_, order) => (
            <div className={ Styles.datetime }>
                { order.deliveryDatetime
                    ? moment(order.deliveryDatetime).format('DD.MM.YYYY HH:mm')
                    : '-' }
            </div>
        ),
    };

    const successDatetimeCol = {
        title:     <FormattedMessage id='orders.success_date' />,
        width:     defWidth.success_datetime_col,
        dataIndex: 'successDatetime',
        key:       'successDatetime',
        render:    (_, order) => (
            <div className={ Styles.datetime }>
                { order.successDatetime
                    ? moment(order.successDatetime).format('DD.MM.YYYY HH:mm')
                    : '-' }
            </div>
        ),
    };

    const createDatetimeCol = {
        title:     <FormattedMessage id='orders.creation_date' />,
        width:     defWidth.create_datetime_col,
        dataIndex: 'datetime',
        key:       'datetime',
        sorter:    true,
        sortOrder: sort.field === 'datetime' ? sortOptions[ sort.order ] : false,
        render:    (_, order) => (
            <div className={ Styles.datetime }>
                { order.datetime
                    ? moment(order.datetime).format('DD.MM.YYYY HH:mm')
                    : '-' }
            </div>
        ),
    };

    const clientCol = {
        title:     <FormattedMessage id='orders.client' />,
        width:     defWidth.client_col,
        dataIndex: 'clientFullName',
        key:       'clientFullName',
        render:    (_, order) => (
            <div className={ Styles.client }>
                <span className={ Styles.clientFullname }>
                    { `${order.clientName || '-'} ${order.clientSurname || ''}` }
                </span>
                <span className={ Styles.clientVehicle }>
                    { `${order.vehicleMakeName ||
                        '-'} ${order.vehicleModelName ||
                        '-'} ${order.vehicleYear || '-'}` }
                </span>
                <a
                    className={ Styles.clientPhone }
                    href={ `tel:${order.clientPhone}` }
                >
                    { order.clientPhone || '-' }
                </a>
            </div>
        ),
    };

    const sumCol = {
        title:     <FormattedMessage id='orders.sum_without_VAT' /> ,
        width:     defWidth.sum_col,
        dataIndex: 'totalSum',
        key:       'totalSum',
        sorter:    true,
        sortOrder: sort.field === 'totalSum' ? sortOptions[ sort.order ] : false,
        render:    (_, order) => (
            <div style={{whiteSpace: 'nowrap'}}>
                <Numeral
                    // TODO
                    currency={ formatMessage({ id: 'currency' }) }
                    nullText='0'
                    mask='0,0.00'
                >
                    { order.servicesTotalSum + order.detailsTotalSum }
                </Numeral>
            </div>
        ),
    };

    const remainingSumCol = {
        title:     <FormattedMessage id='orders.remaining_sum' />,
        width:     defWidth.remaining_sum_col,
        dataIndex: 'remainingSum',
        key:       'remainingSum',
        render:    remainingSum => (
            <Numeral currency={ formatMessage({ id: 'currency' }) } nullText='0'>
                { remainingSum }
            </Numeral>
        ),
    };

    const responsibleCol = {
        title:     <FormattedMessage id='orders.responsible' />,
        width:     defWidth.responsible_col,
        dataIndex: 'managerName',
        key:       'managerName',
        render:    (_, order) => {
            if (order.managerName) {
                return (
                    <div>
                        {order.managerSurname} {order.managerName}
                    </div>
                );
            }

            return  <div>
                        <FormattedMessage id='orders.not_assigned' />
                    </div>;
        },
    };

    const sourceCol = {
        title:     <FormattedMessage id='orders.source' />,
        width:     defWidth.source_col,
        dataIndex: 'changeReason',
        key:       'changeReason',
        render:    (_, order) =>
            order.changeReason ? (
                <FormattedMessage id={ `orders.${order.changeReason}` } />
            ) : (
                <FormattedMessage id='orders.not_provided' />
            ),
    };

    const tasksCol = {
        title:     <FormattedMessage id='orders.tasks' />,
        width:     defWidth.tasks_col,
        dataIndex: 'activeTasks',
        key:       'activeTasks',
        render:    (_, order) => {
            if (order.activeTasks) {
                return (
                    <Link to={ `${book.order}/${order.id}` }>
                        { order.activeTasks }
                    </Link>
                );
            }

            return <FormattedMessage id='orders.no_tasks' />;
        },
    };

    const reviewCol = {
        title:     <FormattedMessage id='orders.review' />,
        width:     defWidth.review_col,
        dataIndex: 'review',
        key:       'review',
        render:    (data, order) => {
            if (_.isNumber(order.nps)) {
                return (
                    <a href={ `${book.feedback}/${order.reviewIds[ 0 ]}` }>
                        <div
                            className={ classNames(Styles.nps, {
                                [ Styles.npsMid ]:
                                    order.nps === 7 || order.nps === 8,
                                [ Styles.npsLow ]: order.nps <= 6,
                            }) }
                        >
                            { Math.round(order.nps) }
                        </div>
                    </a>
                );
            }

            return (
                <Button>
                    <FormattedMessage id='orders.add_feedback' />
                </Button>
            );
        },
    };

    const isInviteButtonDisabled = order => {
        const missingRequiredField = !isOrderInvitable(order);
        const alreadyInvited = isAlreadyInvited(order);
        const forbidden =
            isForbidden(user, permissions.CREATE_ORDER) ||
            isForbidden(user, permissions.CREATE_INVITE_ORDER);

        return (missingRequiredField || alreadyInvited || forbidden);
    };

    const invitationCol = {
        title:     <FormattedMessage id='orders.invitation' />,
        width:     defWidth.invitation_col,
        dataIndex: 'invite',
        key:       'invite',
        render:    (_void, order) => {
            if (!order.vehicleInviteExists) {
                return (
                    <Button
                        type='primary'
                        onClick={ () => action([ order ]) }
                        disabled={ isInviteButtonDisabled(order) }
                    >
                        <FormattedMessage id='orders.invite' />
                    </Button>
                );
            }

            return (
                <Link
                    className={ Styles.inviteLink }
                    to={ `${book.order}/${order.vehicleInviteExists}` }
                >
                    { order.vehicleInviteExists }
                </Link>
            );
        },
    };

    const actionCol = {
        title:     <FormattedMessage id='orders.actions' />,
        width:     defWidth.action_col,
        dataIndex: 'actions',
        key:       'actions',
        render:    () => (
            <div className={ Styles.inviteActions }>
                <Tooltip
                    placement='bottom'
                    title={ <FormattedMessage id='orders.send_sms' /> }
                >
                    <Icon
                        type='message'
                        style={ { fontSize: 24, color: '#08c' } }
                    />
                </Tooltip>
                <Tooltip
                    placement='bottom'
                    title={ <FormattedMessage id='orders.call' /> }
                >
                    <Icon
                        type='phone'
                        style={ { fontSize: 24, color: '#08c' } }
                    />
                </Tooltip>
                <Tooltip
                    placement='bottom'
                    title={ <FormattedMessage id='orders.send_email' /> }
                >
                    <Icon type='mail' style={ { fontSize: 24, color: '#08c' } } />
                </Tooltip>
            </div>
        ),
    };

    const editCol = {
        title:  <Button
                    type={'primary'}
                    onClick={()=>{
                        let token = localStorage.getItem('_my.carbook.pro_token');
                        let url = __API_URL__ + `/orders/repair_map?update=true`;
                        fetch(url, {
                            method:  'PUT',
                            headers: {
                                Authorization: token,
                            },
                        })
                        .then(function(response) {
                            if (response.status !== 200) {
                                return Promise.reject(new Error(response.statusText));
                            }
                            return Promise.resolve(response);
                        })
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(data) {
                            window.location.reload();
                        })
                        .catch(function(error) {
                            console.log('error', error);
                        });
                    }}
                >
                    <FormattedMessage id='orders.update_stage' />
                </Button>,
        width:  defWidth.edit_col,
        key:    'editAction',
        render: (_, order) => (
            <Link to={ `${book.order}/${order.id}` }>
                <Icon className={ Styles.editOrderIcon } type='edit' />
            </Link>
        ),
    };

    if(isMobile) {
        return [
            orderCol,
            datetimeCol,
            clientCol,
            sumCol,
        ]
    }

    switch (activeRoute) {
        case '/orders/appointments':
            return [
                indexCol,
                orderCol,
                datetimeCol,
                beginDatetimeCol,
                clientCol,
                sumCol,
                responsibleCol,
                sourceCol,
                tasksCol,
                editCol,
            ];

        case '/orders/approve':
        case '/orders/progress':
            return [
                indexCol,
                orderCol,
                beginDatetimeCol,
                deliveryDatetimeCol,
                clientCol,
                sumCol,
                responsibleCol,
                sourceCol,
                editCol,
            ];

        case '/orders/success':
            return [
                indexCol,
                orderCol,
                beginDatetimeCol,
                successDatetimeCol,
                clientCol,
                sumCol,
                remainingSumCol,
                responsibleCol,
                sourceCol,
                reviewCol,
                invitationCol,
                editCol,
            ];

        case '/orders/cancel':
            return [
                indexCol,
                orderCol,
                beginDatetimeCol,
                clientCol,
                sumCol,
                responsibleCol,
                sourceCol,
                invitationCol,
                editCol,
            ];

        case '/orders/reviews':
            return [
                indexCol,
                orderCol,
                reviewCol,
                beginDatetimeCol,
                successDatetimeCol,
                clientCol,
                sumCol,
                responsibleCol,
                sourceCol,
                editCol,
            ];

        case '/orders/invitations':
            return [
                indexCol,
                orderCol,
                createDatetimeCol,
                beginDatetimeCol,
                clientCol,
                actionCol,
                responsibleCol,
                editCol,
            ];

        default:
            return [
                indexCol,
                orderCol,
                datetimeCol,
                beginDatetimeCol,
                clientCol,
                sumCol,
                responsibleCol,
                sourceCol,
                tasksCol,
                editCol,
            ];
    }
}

export function rowsConfig(
    activeRoute,
    selectedRowKeys,
    onChange,
    getCheckboxProps,
) {
    if (activeRoute === '/orders/success' || activeRoute === '/orders/cancel') {
        return {
            selectedRowKeys,
            onChange,
            getCheckboxProps,
        };
    }

    return null;
}

export function scrollConfig(activeRoute) {
    switch (activeRoute) {
        case '/orders/appointments':
            return { x: 1500, y: '70vh' }; //1600 - 80 -
        case '/orders/approve':
            return { x: 1340, y: '70vh' };
        case '/orders/progress':
            return { x: 1340, y: '70vh' }; //1440 - 80 - 20
        case '/orders/success':
            return { x: 1860, y: '70vh' }; //1820
        case '/orders/reviews':
            return { x: 1520, y: '70vh' }; //1620
        case '/orders/invitations':
            return { x: 1260, y: '70vh' }; //1400
        case 'orders/cancel':
            return { x: 1400, y: '70vh' }; //1640 // -160 second date
        default:
            return { x: 1540, y: '70vh' }; //1640
    }
}
