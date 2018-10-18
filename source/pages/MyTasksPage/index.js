// vendor
import React, { Component } from 'react';
import MyTasksContainer from 'containers/MyTasksContainer';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Radio, Input } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import {
    resetOrderTasksForm,
    saveOrderTask,
    changeModalStatus,
} from 'core/forms/orderTaskForm/duck';
import { OrderTaskModal } from 'modals';
import { Layout, Spinner } from 'commons';
import {
    fetchMyTasks,
    resetData,
    setMyTasksDaterangeFilter,
    setMyTasksSortFieldFilter,
    setMyTasksSortOrderFilter,
    setMyTasksSearchFilter,
    setMyTasksStatusFilter,
} from 'core/myTasks/duck';
import { getDaterange } from 'utils';
import { setModal, resetModal } from 'core/modals/duck';
import Styles from './styles.m.css';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;

const compareOrderTasks = (initialOrderTask, orderTask) => {
    if (!initialOrderTask) {
        return true;
    }

    const initialOrderTaskEntity = {
        responsibleId: initialOrderTask.responsibleId,
        priority:      initialOrderTask.priority,
        status:        initialOrderTask.status,
        comment:       initialOrderTask.comment,
        time:          initialOrderTask.deadlineDate
            ? moment(initialOrderTask.deadlineDate).format('HH:mm')
            : void 0,
        date: initialOrderTask.deadlineDate
            ? moment(initialOrderTask.deadlineDate).format('YYYY-MM-DD')
            : void 0,
        stationNum: initialOrderTask.stationNum,
    };

    const orderTaskEntity = {
        responsibleId: orderTask.responsible,
        priority:      orderTask.priority,
        status:        orderTask.status,
        comment:       orderTask.comment,
        time:          orderTask.deadlineTime
            ? moment(orderTask.deadlineTime).format('HH:mm')
            : void 0,
        date: orderTask.deadlineDate
            ? moment(orderTask.deadlineDate).format('YYYY-MM-DD')
            : void 0,
        stationNum: orderTask.stationName,
    };

    return !_.isEqual(_.omitBy(orderTaskEntity, _.isNil), _.omitBy(initialOrderTaskEntity, _.isNil));
};

const mapStateToProps = state => {
    return {
        myTasks:          state.myTasksContainer.myTasks,
        page:             state.myTasksContainer.page,
        modal:            state.modals.modal,
        // orderTaskEntity:  state.forms.orderTaskForm.fields,
        initialOrderTask: state.forms.orderTaskForm.initialOrderTask,
        orderTaskId:      state.forms.orderTaskForm.taskId,
        activeOrder:      state.myTasksContainer.activeOrder,
        activeVehicle:    state.myTasksContainer.vehicle,
        spinner:          state.ui.myTasksFetching,
        filter:           state.myTasksContainer.filters,
        isMobile:         state.ui.views.isMobile,
    };
};

const mapDispatchToProps = {
    setModal,
    resetModal,
    resetOrderTasksForm,
    saveOrderTask,
    changeModalStatus,
    fetchMyTasks,
    resetData,
    setMyTasksDaterangeFilter,
    setMyTasksSearchFilter,
    setMyTasksStatusFilter,
    setMyTasksSortFieldFilter,
    setMyTasksSortOrderFilter,
};
@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class MyTasksPage extends Component {
    constructor(props) {
        super(props);

        this.handleOrdersSearch = _.debounce(value => {
            const { setMyTasksSearchFilter, fetchMyTasks, filter } = this.props;
            setMyTasksSearchFilter(value);
            fetchMyTasks(filter);
        }, 1000);

        this.state = {
            button: 'all',
        }
    }

    componentDidMount() {
        const { filter, fetchMyTasks } = this.props;
        fetchMyTasks(filter, true);
    }

    _selectStatus(ev) {
        const { setMyTasksStatusFilter, fetchMyTasks, filter } = this.props;

        setMyTasksStatusFilter(ev.target.value);
        fetchMyTasks(filter);
    }

    _saveOrderTaskFormRef = formRef => {
        this.orderTaskFormRef = formRef;
    };

    saveOrderTask = () => {
        const { orderTaskId, initialOrderTask } = this.props;
        const form = this.orderTaskFormRef.props.form;
        let myTasks = 'mytasks';
        form.validateFields((err, values) => {
            if (!err) {
                if (compareOrderTasks(initialOrderTask, values)) {
                    this.props.saveOrderTask(
                        values,
                        this.props.activeOrder,
                        orderTaskId,
                        myTasks,
                    );
                    this.props.resetModal();
                    this.props.resetOrderTasksForm();
                } else {
                    this.props.resetModal();
                    this.props.resetOrderTasksForm();
                }
            }
        });
    };

    _handleRadioDaterange = event => {
        const { fetchMyTasks, filter, setMyTasksDaterangeFilter } = this.props;
        const daterange = event.target.value;
        this.setState({ button: daterange });
        if (daterange === 'all') {
            setMyTasksDaterangeFilter({});
        } else if (daterange !== 'all') {
            const daterangeFilter = getDaterange(daterange);
            setMyTasksDaterangeFilter({ ...daterangeFilter });
        }
        fetchMyTasks(filter);
    };
    _renderHeaderContorls = () => {
        const { button } = this.state;

        return (
            <RadioGroup
                defaultValue={ button }
                // defaultValue={ ordersDaterangeFilter }
                onChange={ this._handleRadioDaterange }
                className={ Styles.filters }
            >
                <RadioButton value='all'>
                    <FormattedMessage id='orders-page.all' />
                </RadioButton>
                <RadioButton value='today'>
                    <FormattedMessage id='orders-page.today' />
                </RadioButton>
                <RadioButton value='tomorrow'>
                    <FormattedMessage id='orders-page.tomorrow' />
                </RadioButton>
                <RadioButton value='nextWeek'>
                    <FormattedMessage id='orders-page.week' />
                </RadioButton>
                <RadioButton value='nextMonth'>
                    <FormattedMessage id='orders-page.month' />
                </RadioButton>
            </RadioGroup>
        );
    };
    /* eslint-disable complexity*/
    render() {
        const headerControls = this._renderHeaderContorls();
        const {
            myTasks,
            resetModal,
            modal,
            activeOrder,
            activeVehicle,
            orderTaskId,
            progressStatusOptions,
            priorityOptions,
            spinner,
            filter,
            isMobile,
            intl,
            setMyTasksSortOrderFilter,
            setMyTasksSortFieldFilter,
            fetchMyTasks,
            initialOrderTask,
        } = this.props;

        return spinner ? (
            <Spinner spin={ spinner } />
        ) : (
            <Layout
                paper={ false }
                title={ <FormattedMessage id='navigation.mytasks' /> }
                description={ <FormattedMessage id='order-task.description' /> }
                controls={
                    <div className={ Styles.controls }>
                        { !isMobile && headerControls }
                    </div>
                }
            >
                <div className={ Styles.filter }>
                    <Search
                        className={ Styles.search }
                        placeholder={ intl.formatMessage({
                            id: 'orders-filter.search_placeholder',
                        }) }
                        defaultValue={ filter.query }
                        onChange={ ({ target: { value } }) =>
                            this.handleOrdersSearch(value)
                        }
                    />
                    <RadioGroup
                        onChange={ ev => this._selectStatus(ev) }
                        className={ Styles.buttonFilterGroup }
                        defaultValue={ filter.status }
                    >
                        <RadioButton value='all'>
                            <FormattedMessage id='all' />
                        </RadioButton>
                        <RadioButton value='active'>
                            <FormattedMessage id='active' />
                        </RadioButton>
                    </RadioGroup>
                </div>
                <div className={ Styles.myTasksWrapper }>
                    <MyTasksContainer
                        setMyTasksSortOrderFilter={ setMyTasksSortOrderFilter }
                        setMyTasksSortFieldFilter={ setMyTasksSortFieldFilter }
                        myTasks={ myTasks }
                        fetchMyTasks={ fetchMyTasks }
                        filter={ filter }
                        page={ filter.page }
                    />
                </div>
                <OrderTaskModal
                    wrappedComponentRef={ this._saveOrderTaskFormRef }
                    initialOrderTask={ initialOrderTask }
                    priorityOptions={ priorityOptions }
                    progressStatusOptions={ progressStatusOptions }
                    visible={ modal }
                    resetModal={ resetModal }
                    num={ activeOrder }
                    orderTaskId={ orderTaskId }
                    orderId={ activeOrder }
                    activeVehicle={ activeVehicle }
                    resetOrderTasksForm={ this.props.resetOrderTasksForm }
                    stations={ myTasks && myTasks.stations || [] }
                    managers={ myTasks && myTasks.managers || [] }
                    saveNewOrderTask={ this.saveOrderTask }
                    orderTasks={ myTasks && myTasks.orderTasks || [] }
                />
            </Layout>
        );
    }
}

export default MyTasksPage;
