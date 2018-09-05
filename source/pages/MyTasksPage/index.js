// vendor
import React, { Component } from 'react';
import MyTasksContainer from 'containers/MyTasksContainer';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Button, Radio, Input } from 'antd';
import _ from 'lodash';

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
import { withResponsive, getDaterange } from 'utils';
import book from 'routes/book';
import { setModal, MODALS, resetModal } from 'core/modals/duck';
import Styles from './styles.m.css';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;

const mapStateToProps = state => {
    return {
        myTasks:         state.myTasksContainer.myTasks,
        page:            state.myTasksContainer.page,
        modal:           state.modals.modal,
        orderTaskEntity: state.forms.orderTaskForm.fields,
        orderTaskId:     state.forms.orderTaskForm.taskId,
        activeOrder:     state.myTasksContainer.activeOrder,
        activeVehicle:   state.myTasksContainer.vehicle,
        spinner:         state.ui.myTasksFetching,
        filter:          state.myTasksContainer.filters,
        isMobile:        state.ui.views.isMobile,
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
            const { setMyTasksSearchFilter, fetchOrders, filter } = this.props;
            setMyTasksSearchFilter(value);
            // fetchOrders({ page: 1, ...filter });
        }, 1000);
    }
    state = {
        button: 'all',
    };
    selectStatus(ev) {
        const { setMyTasksStatusFilter, fetchMyTasks, filter } = this.props;

        setMyTasksStatusFilter(ev.target.value);
        fetchMyTasks(filter);
    }
    componentDidMount() {
        const { filter, fetchMyTasks } = this.props;
        fetchMyTasks(filter);
    }
    saveOrderTaskFormRef = formRef => {
        this.orderTaskFormRef = formRef;
    };

    saveOrderTask = () => {
        const { orderTaskEntity, orderTaskId } = this.props;
        const form = this.orderTaskFormRef.props.form;
        let myTasks = 'mytasks';
        form.validateFields(err => {
            if (!err) {
                this.props.saveOrderTask(
                    orderTaskEntity,
                    this.props.activeOrder,
                    orderTaskId,
                    myTasks,
                );
                this.props.resetModal();
                this.props.resetOrderTasksForm();
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
        const { filter } = this.props;
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
            orderTaskEntity,
            progressStatusOptions,
            priorityOptions,
            spinner,
            filter,
            resetData,
            setModal,
            isMobile,
            intl,
            setMyTasksSortOrderFilter,
            setMyTasksSortFieldFilter,
            fetchMyTasks,
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
                        <div className={ Styles.buttonGroup }>
                            <Button
                                type='primary'
                                onClick={ () => {
                                    setModal(MODALS.ORDER_TASK);
                                    resetData();
                                } }
                            >
                                <FormattedMessage id='add_task' />
                            </Button>
                        </div>
                    </div>
                }
            >
                <div className={ Styles.filter }>
                    <Search
                        className={ Styles.search }
                        placeholder={ intl.formatMessage({
                            id: 'orders-filter.search_placeholder',
                        }) }
                        onChange={ ({ target: { value } }) =>
                            this.handleOrdersSearch(value)
                        }
                    />
                    <RadioGroup
                        onChange={ ev => this.selectStatus(ev) }
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
                <MyTasksContainer
                    setMyTasksSortOrderFilter={ setMyTasksSortOrderFilter }
                    setMyTasksSortFieldFilter={ setMyTasksSortFieldFilter }
                    myTasks={ myTasks }
                    fetchMyTasks={ fetchMyTasks }
                    filter={ filter }
                    page={ filter.page }
                />

                <OrderTaskModal
                    wrappedComponentRef={ this.saveOrderTaskFormRef }
                    orderTaskEntity={ orderTaskEntity }
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
