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

    const clientsCol = {
        title:     <FormattedMessage id='client' />,
        width:     220,
        dataIndex: 'name',
        key:       'name',
        // fixed:     'left',
        render:    (_, client) => (
            <div>
                { client.name } { client.surname }
            </div>
        ),
    };

    const datetimeCol = {
        title:     <FormattedMessage id='orders.creation_date' />,
        dataIndex: 'datetime',
        key:       'datetime',
        sorter:    true,
        sortOrder: sort.field === 'datetime' ? sortOptions[ sort.order ] : false,
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
        title:     <FormattedMessage id='orders.begin_date' />,
        dataIndex: 'beginDatetime',
        key:       'beginDatetime',
        sortOrder:
            sort.field === 'beginDatetime' ? sortOptions[ sort.order ] : false,
        sorter: true,
        width:  160,
        render: (_, order) => (
            <div className={ Styles.datetime }>
                { order.beginDatetime
                    ? moment(order.beginDatetime).format('DD.MM.YYYY HH:mm')
                    : '-' }
            </div>
        ),
    };

    const successDatetimeCol = {
        title:     <FormattedMessage id='orders.success_date' />,
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

    const createDatetimeCol = {
        title:     <FormattedMessage id='orders.creation_date' />,
        dataIndex: 'datetime',
        key:       'datetime',
        sorter:    true,
        sortOrder: sort.field === 'datetime' ? sortOptions[ sort.order ] : false,
        width:     160,
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
        dataIndex: 'clientFullName',
        key:       'clientFullName',
        width:     220,
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
        title:     <FormattedMessage id='orders.sum' />,
        dataIndex: 'totalSum',
        key:       'totalSum',
        sorter:    true,
        sortOrder: sort.field === 'totalSum' ? sortOptions[ sort.order ] : false,
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
        title:     <FormattedMessage id='orders.responsible' />,
        dataIndex: 'managerName',
        key:       'managerName',
        width:     190,
        render:    (_, order) => {
            if (order.managerName) {
                return `${order.managerName} ${order.managerSurname &&
                    order.managerSurname}`;
            }

            return <FormattedMessage id='orders.not_assigned' />;
        },
    };

    const sourceCol = {
        title:     <FormattedMessage id='orders.source' />,
        dataIndex: 'changeReason',
        key:       'changeReason',
        width:     125,
        render:    (_, order) =>
            order.changeReason ? (
                <FormattedMessage id={ `orders.${order.changeReason}` } />
            ) : (
                <FormattedMessage id='orders.not_provided' />
            ),
    };

    const tasksCol = {
        title:     <FormattedMessage id='orders.tasks' />,
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

            return <FormattedMessage id='orders.no_tasks' />;
        },
    };

    const reviewCol = {
        title:     <FormattedMessage id='orders.review' />,
        dataIndex: 'review',
        key:       'review',
        width:     175,
        render:    (_, order) => {
            if (order.nps) {
                return (
                    <a href={ `${book.oldApp.reviews}/${order.reviewIds[ 0 ]}` }>
                        <div
                            className={ classNames(Styles.nps, {
                                [ Styles.npsMid ]:
                                    order.nps === 7 || order.nps === 8,
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
                    <FormattedMessage id='orders.add_feedback' />
                </Button>
            );
        },
    };
}
