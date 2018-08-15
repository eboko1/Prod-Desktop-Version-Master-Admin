// vendor
import React, { Component } from 'react';
import { Table, Icon, Tooltip } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { v4 } from 'uuid';

// proj
import { withReduxForm } from 'utils';
import {
    fetchMyTasks,
    setPage,
    onChangeMyTasksForm,
    getActiveOrder,
} from 'core/myTasks/duck';
import { initOrderTasksForm } from 'core/forms/orderTaskForm/duck';
import { setModal, MODALS } from 'core/modals/duck';

import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';

@injectIntl
@withReduxForm({
    name:    'myTasksForm',
    actions: {
        change: onChangeMyTasksForm,
        fetchMyTasks,
        setModal,
        initOrderTasksForm,
        getActiveOrder,
        setPage,
    },
})
export default class MyTasksContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sort: { field: 'startDate', order: 'desc' },
        };
        this.columns = [
            {
                title:     '',
                dataIndex: 'review',
                width:     '2%',
                render:    (text, record) => {
                    if (record.orderNum) {
                        if (record.status !== 'CLOSED') {
                            return (
                                <Icon
                                    className={ Styles.editOrderTaskIcon }
                                    onClick={ () => {
                                        this.props.initOrderTasksForm(record);
                                        this.props.setModal(MODALS.ORDER_TASK);
                                        this.props.getActiveOrder(
                                            record.orderId,
                                        );
                                    } }
                                    type='edit'
                                />
                            );
                        }
                    }
                },
            },

            {
                title:     <FormattedMessage id='orderNumber' />,
                dataIndex: 'orderNum',
                width:     '7%',
            },
            {
                title:     <FormattedMessage id='status' />,
                dataIndex: 'status',
                width:     '7%',
                render:    (text, record) => {
                    return text ? <FormattedMessage id={ text } /> : '';
                },
            },
            {
                title:     <FormattedMessage id='priority' />,
                dataIndex: 'priority',
                width:     '6%',
                render:    (text, record) => {
                    return text ? <FormattedMessage id={ text } /> : null;
                },
                sorter: true,
            },
            {
                title:     <FormattedMessage id='urgency' />,
                dataIndex: 'urgency',
                width:     '7%',
                render:    (text, record) => {
                    return text ? <FormattedMessage id={ text } /> : null;
                },
            },
            {
                title:     <FormattedMessage id='vehicle' />,
                dataIndex: 'vehicleMakeName',
                width:     '7%',
                render:    (text, record) => {
                    return record.vehicleMakeName ? (
                        <div>
                            { record.vehicleMakeName } { record.vehicleModelName }
                        </div>
                    ) : null;
                },
            },
            {
                title:     <FormattedMessage id='responsible' />,
                dataIndex: 'responsibleName',
                width:     '7%',
                render:    (text, record) => {
                    return (
                        <div style={ { wordBreak: 'normal' } }>{ `${text} ${
                            record.responsibleSurname
                        }` }</div>
                    );
                },
            },
            {
                title:     <FormattedMessage id='position' />,
                dataIndex: 'position',
                width:     '7%',
            },
            {
                title:     <FormattedMessage id='stationName' />,
                dataIndex: 'stationName',
                width:     '7%',
            },
            {
                title:     <FormattedMessage id='startDate' />,
                dataIndex: 'startDate',
                width:     '7%',
                render:    (text, record) => (
                    <div>
                        { text ? moment(text).format('DD.MM.YYYY HH:mm') : null }
                    </div>
                ),
                defaultSortOrder: 'descend',
                sorter:           true,
            },
            {
                title:     <FormattedMessage id='deadlineDate' />,
                dataIndex: 'deadlineDate',
                width:     '7%',
                render:    (text, record) => (
                    <div>
                        { ' ' }
                        { text ? moment(text).format('DD.MM.YYYY HH:mm') : null }
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='duration' />,
                dataIndex: 'duration',
                width:     '9%',
                render:    (text, record) => {
                    // let durationText = moment.duration(text, 'seconds');
                    // let duration = moment
                    //     .utc(durationText.asMilliseconds())
                    //     .format('HH:mm');

                    return (
                        <div>
                            { text
                                ? moment
                                    .duration(text, 'milliseconds')
                                    .humanize()
                                : null }
                        </div>
                    );
                },
                sorter: true,
            },
            {
                title:     <FormattedMessage id='endDate' />,
                dataIndex: 'endDate',
                width:     '7%',
                render:    (text, record) => (
                    <div>
                        { text ? moment(text).format('DD.MM.YYYY HH:mm') : null }
                    </div>
                ),
                sorter: true,
            },
            {
                title:     <FormattedMessage id='comment' />,
                dataIndex: 'comment',
                width:     '7%',
                render:    (text, record) => (
                    <div>
                        <Tooltip
                            placement='bottomLeft'
                            title={
                                <div
                                // style={ {
                                //     whiteSpace: 'nowrap',
                                //     wordBreak:  'break-all',
                                //     height:     '100%'} }
                                >
                                    { text }
                                </div>
                            }
                            getPopupContainer={ trigger => trigger.parentNode }
                        >
                            <div className={ Styles.commentDiv }>{ text }</div>
                        </Tooltip>
                    </div>
                ),
            },
            {
                title:     <FormattedMessage id='author' />,
                dataIndex: 'author',
                width:     '10%',
                render:    (text, record) => (
                    <div>
                        { record.authorName } { record.authorSurname }
                    </div>
                ),
            },
        ];
    }

    componentDidMount() {
        this.props.fetchMyTasks(2);
    }
    handleTableChange = (pagination, filters, sorter) => {
        if (!sorter) {
            return;
        }
        const sort = {
            field: sorter.field,
            order: sorter.order === 'ascend' ? 'ascend' : 'descend',
        };
        this.setState({ sort });
    };

    sortTable = (a, b) => {
        const { sort } = this.state;
        let priorities = {
            LOW:      1,
            NORMAL:   2,
            HIGH:     3,
            CRITICAL: 4,
        };
        if (sort.field === 'priority' && sort.order === 'ascend') {
            return (
                (priorities[ a.priority ] || 0) - (priorities[ b.priority ] || 0)
            );
        } else if (sort.field === 'priority' && sort.order === 'descend') {
            return (
                (priorities[ b.priority ] || 0) - (priorities[ a.priority ] || 0)
            );
        }
        if (sort.field === 'duration' && sort.order === 'ascend') {
            return a.duration - b.duration;
        } else if (sort.field === 'duration' && sort.order === 'descend') {
            return b.duration - a.duration;
        }
        if (sort.order === 'ascend') {
            var c = new Date(a[ sort.field ]);
            var d = new Date(b[ sort.field ]);

            return c - d;
        }
        var c = new Date(a[ sort.field ]);
        var d = new Date(b[ sort.field ]);

        return d - c;

        return 0;
    };

    render() {
        const { myTasks, page } = this.props;
        const columns = this.columns;
        // const { sortField, sortArrow } = this.state;
        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            myTasks ? myTasks.length : 25,
            hideOnSinglePage: true,
            current:          page,
            onChange:         page => {
                this.props.setPage(page);
                this.props.fetchMyTasks(page);
            },
        };

        return (
            <Catcher>
                { /* <section className={ Styles.filters }>
                    <DecoratedDatePicker
                        field='filterDate'
                        label={ <FormattedMessage id='filterDate' /> }
                        formItem
                        ranges
                        formatMessage={ formatMessage }
                        className={ Styles.selectMargin }
                        getFieldDecorator={ getFieldDecorator }
                        value={ null }
                        getCalendarContainer={ trigger => trigger.parentNode }
                        format={ 'YYYY-MM-DD' }
                        placeholder={
                            <FormattedMessage id='order_task_modal.deadlineDate_placeholder' />
                        }/>
                </section> */ }
                <section className={ Styles.myTasks }>
                    <Table
                        dataSource={
                            myTasks && myTasks.orderTasks.length > 0
                                ? myTasks.orderTasks
                                    .sort(this.sortTable)
                                    .map((task, index) => ({
                                        ...task,
                                        index,
                                        key: v4(),
                                    }))
                                : []
                        }
                        size='small'
                        scroll={ {
                            x: 2200,
                            // y: '50vh',
                        } }
                        columns={ columns }
                        pagination={ pagination }
                        locale={ {
                            emptyText: <FormattedMessage id='no_data' />,
                        } }
                        onChange={ this.handleTableChange }
                    />
                </section>
            </Catcher>
        );
    }
}
