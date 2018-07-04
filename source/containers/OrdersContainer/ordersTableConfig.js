// vendor
import React from 'react';
import {Link} from 'react-router-dom';
import {injectIntl, FormattedMessage} from 'react-intl';
import {Icon, Tooltip, Button} from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

// proj
import {OrderStatusIcon, Numeral} from 'components';
import book from 'routes/book';

// own
import Styles from './styles.m.css';

// /// /// //
// if class in construc
// const TableMagic = (props) => {
// columnConfig(activeRo){}
//   return (
//     <orderTab props={columnConfig}
//   );
// };
// withRouter(TableMagic)
// // //

export function columnsConfig(invited,
    action,
    isOrderInvitable,
    isAlreadyInvited,
    activeRoute) {
    const indexCol = {
        title:     '№',
        width:     80,
        dataIndex: 'index',
        key:       'index',
        // fixed:     'left',
    };

    const orderCol = {
        title:     <FormattedMessage id='orders.order'/>,
        width:     220,
        dataIndex: 'num',
        key:       'num',
        // fixed:     'left',
        render:    (_, order) =>
            <>
                <Link
                    className={ Styles.ordernLink }
                    to={ `${book.order}/${order.id}` }
                >
                    { order.num }
                </Link>
                <OrderStatusIcon status={ order.status }/>
                {order.serviceNames && (
                    <div className={ Styles.serviceNames }>
                        { [ ...new Set(order.serviceNames) ].join(', ') }
                    </div>
                )}
                {order.recommendation && (
                    <div className={ Styles.recommendation }>
                        { order.recommendation }
                    </div>
                )}
                {(order.cancelReason ||
                order.cancelStatusReason ||
                order.cancelStatusOwnReason) && (
                    <div className={ Styles.cancelReason }>
                        { /* <div>{ order.cancelReason }</div> */ }
                        <div>{ order.cancelStatusReason }</div>
                        <div>{ order.cancelStatusOwnReason }</div>
                    </div>
                )}
            </>
        ,
    };

    const datetimeCol = {
        title:     <FormattedMessage id='orders.creation_date'/>,
        dataIndex: 'datetime',
        key:       'datetime',
        width:     160,
        render:    (_, order) => (
            <div className={ Styles.datetime }>
                { order.datetime
                    ? moment(order.datetime).format('DD.MM.YYYY HH:mm')
                    : '-' }
            </div>
        ),
    };

    const beginDatetimeCol = {
        title:     <FormattedMessage id='orders.begin_date'/>,
        dataIndex: 'beginDatetime',
        key:       'beginDatetime',
        width:     160,
        render:    (_, order) => (
            <div className={ Styles.datetime }>
                { order.beginDatetime
                    ? moment(order.beginDatetime).format('DD.MM.YYYY HH:mm')
                    : '-' }
            </div>
        ),
    };

    const successDatetimeCol = {
        title:     <FormattedMessage id='orders.success_date'/>,
        dataIndex: 'successDatetime',
        key:       'successDatetime',
        width:     160,
        render:    (_, order) => (
            <div className={ Styles.datetime }>
                { order.successDatetime
                    ? moment(order.successDatetime).format('DD.MM.YYYY HH:mm')
                    : '-' }
            </div>
        ),
    };

    const clientCol = {
        title:     <FormattedMessage id='orders.client'/>,
        dataIndex: 'clientFullName',
        key:       'clientFullName',
        width:     300,
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
        title:     <FormattedMessage id='orders.sum'/>,
        dataIndex: 'servicesTotalSum',
        key:       'servicesTotalSum',
        width:     140,
        render:    (_, order) => (
            <Numeral
                // TODO intl.formattedMessage({ id: currency})
                currency='грн.'
                nullText='0'
            >
                { order.servicesTotalSum + order.detailsTotalSum }
            </Numeral>
        ),
    };

    const responsibleCol = {
        title:     <FormattedMessage id='orders.responsible'/>,
        dataIndex: 'managerName',
        key:       'managerName',
        width:     190,
        render:    (_, order) => {
            if (order.managerName) {
                return `${order.managerName} ${order.managerSurname &&
                order.managerSurname}`;
            }

            return <FormattedMessage id='orders.not_assigned'/>;
        },
    };

    const sourceCol = {
        title:     <FormattedMessage id='orders.source'/>,
        dataIndex: 'changeReason',
        key:       'changeReason',
        width:     120,
        render:    (_, order) =>
            order.changeReason ? (
                <FormattedMessage id={ `orders.${order.changeReason}` }/>
            ) : (
                <FormattedMessage id='orders.not_provided'/>
            ),
    };

    const tasksCol = {
        title:     <FormattedMessage id='orders.tasks'/>,
        dataIndex: 'activeTasks',
        key:       'activeTasks',
        width:     150,
        render:    (_, order) => {
            if (order.activeTasks) {
                return (
                    <Link to={ `${book.order}/${order.id}` }>
                        { order.activeTasks }
                    </Link>
                );
            }

            return <FormattedMessage id='orders.no_tasks'/>;
        },
    };

    const reviewCol = {
        title:     <FormattedMessage id='orders.review'/>,
        dataIndex: 'review',
        key:       'review',
        width:     175,
        render:    (_, order) => {
            if (order.nps) {
                return (
                    <a href={ `${book.oldApp.reviews}/${order.reviewIds[ 0 ]}` }>
                        <div
                            className={ classNames(Styles.nps, {
                                [ Styles.npsMid ]: order.nps === 7 || order.nps === 8,
                                [ Styles.npsLow ]: order.nps <= 6,
                            }) }
                        >
                            { order.nps }
                        </div>
                    </a>
                );
            }

            return (
                <Button>
                    <FormattedMessage id='orders.add_review'/>
                </Button>
            );
        },
    };

    const isInviteButtonDisabled = order => {
        const missingRequiredField = !isOrderInvitable(order);
        const alreadyInvited = isAlreadyInvited(order);

        return !!(missingRequiredField || alreadyInvited);
    };

    const invitationCol = {
        title:     <FormattedMessage id='orders.invitation'/>,
        dataIndex: 'invite',
        key:       'invite',
        width:     150,
        render:    (_void, order) => {
            if (!order.vehicleInviteExists) {
                return (
                    <Button
                        type='primary'
                        onClick={ () => action([ order ]) }
                        disabled={ isInviteButtonDisabled(order) }
                    >
                        <FormattedMessage id='orders.invite'/>
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

    // const reasonCol = {
    //     title:     <FormattedMessage id='orders.reason' />,
    //     dataIndex: 'reason',
    //     key:       'reason',
    //     width:     190,
    //     render:    (_, order) => {
    //         if (
    //             order.cancelReason ||
    //             order.cancelStatusReason ||
    //             order.cancelStatusOwnReason
    //         ) {
    //             return (
    //                 <Button>
    //                     <FormattedMessage id='orders.show_reason' />
    //                 </Button>
    //             );
    //         }
    //
    //         return <FormattedMessage id='orders.no_data' />;
    //     },
    // };

    const actionCol = {
        title:     <FormattedMessage id='orders.actions'/>,
        dataIndex: 'actions',
        key:       'actions',
        width:     180,
        render:    () => (
            <div className={ Styles.inviteActions }>
                <Tooltip
                    placement='bottom'
                    title={ <FormattedMessage id='orders.send_sms'/> }
                >
                    <Icon
                        type='message'
                        style={ {fontSize: 24, color: '#08c'} }
                    />
                </Tooltip>
                <Tooltip
                    placement='bottom'
                    title={ <FormattedMessage id='orders.call'/> }
                >
                    <Icon
                        type='phone'
                        style={ {fontSize: 24, color: '#08c'} }
                    />
                </Tooltip>
                <Tooltip
                    placement='bottom'
                    title={ <FormattedMessage id='orders.send_email'/> }
                >
                    <Icon type='mail' style={ {fontSize: 24, color: '#08c'} }/>
                </Tooltip>
            </div>
        ),
    };

    const editCol = {
        title:  '',
        key:    'editAction',
        // fixed:  'right',
        width:  'auto',
        render: (_, order) => (
            <Link to={ `${book.order}/${order.id}` }>
                <Icon className={ Styles.editOrderIcon } type='edit'/>
            </Link>
        ),
    };

    switch (activeRoute) {
        case '/orders/appointments':
            return [ indexCol, orderCol, datetimeCol, beginDatetimeCol, clientCol, sumCol, responsibleCol, sourceCol, tasksCol, editCol ];

        case '/orders/approved':
        case '/orders/in-progress':
            return [ indexCol, orderCol, datetimeCol, beginDatetimeCol, clientCol, sumCol, responsibleCol, sourceCol, editCol ];

        case '/orders/success':
            return [ indexCol, orderCol, beginDatetimeCol, successDatetimeCol, clientCol, sumCol, responsibleCol, sourceCol, reviewCol, invitationCol, editCol ];

        case '/orders/canceled':
            return [ indexCol, orderCol, beginDatetimeCol, successDatetimeCol, clientCol, sumCol, responsibleCol, sourceCol, invitationCol, editCol ];

        case '/orders/reviews':
            return [ indexCol, orderCol, beginDatetimeCol, successDatetimeCol, clientCol, sumCol, responsibleCol, sourceCol, reviewCol, editCol ];

        case '/orders/invitations':
            return [ indexCol, orderCol, beginDatetimeCol, successDatetimeCol, clientCol, actionCol, responsibleCol, editCol ];

        default:
            return [ indexCol, orderCol, datetimeCol, beginDatetimeCol, clientCol, sumCol, responsibleCol, sourceCol, tasksCol, editCol ];
    }
}

export function rowsConfig(activeRoute,
    selectedRowKeys,
    onChange,
    getCheckboxProps) {
    if (
        activeRoute === '/orders/success' ||
        activeRoute === '/orders/canceled'
    ) {
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
            return {x: 1600};
        case '/orders/in-progress':
        case '/orders/approve':
            return {x: 1440};
        case '/orders/success':
            return {x: 1820};
        case '/orders/reviews':
            return {x: 1620};
        case '/orders/invitations':
            return {x: 1400};
        case 'orders/canceled':
            return {x: 1640};
        default:
            return {x: 1640};
    }
}
