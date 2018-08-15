// vendor
import React, { Component } from 'react';
import MyTasksContainer from 'containers/MyTasksContainer';
import { connect } from 'react-redux';
import { setModal, resetModal } from 'core/modals/duck';

// proj
import {
    resetOrderTasksForm,
    saveOrderTask,
    changeModalStatus,
} from 'core/forms/orderTaskForm/duck';
import { OrderTaskModal } from 'modals';
import { Layout, Spinner } from 'commons';
import { fetchMyTasks } from 'core/myTasks/duck';

const mapStateToProps = state => {
    return {
        myTasks:         state.myTasksContainer.myTasks,
        page:            state.myTasksContainer.page,
        modal:           state.modals.modal,
        orderTaskEntity: state.forms.orderTaskForm.fields,
        orderTaskId:     state.forms.orderTaskForm.taskId,
        activeOrder:     state.myTasksContainer.activeOrder,
        spinner:         state.ui.myTasksFetching,
    };
};

const mapDispatchToProps = {
    setModal,
    resetModal,
    resetOrderTasksForm,
    saveOrderTask,
    changeModalStatus,
    fetchMyTasks,
};

@connect(mapStateToProps, mapDispatchToProps)
class MyTasksPage extends Component {
    componentDidMount() {
        this.props.fetchMyTasks();
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
    /* eslint-disable complexity*/
    render() {
        const {
            myTasks,
            resetModal,
            modal,
            activeOrder,
            orderTaskId,
            orderTaskEntity,
            progressStatusOptions,
            priorityOptions,
            spinner,
            page,
        } = this.props;

        return !spinner ? (
            <Layout>
                <MyTasksContainer myTasks={ myTasks } page={ page } />

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
                    resetOrderTasksForm={ this.props.resetOrderTasksForm }
                    stations={ myTasks && myTasks.stations || [] }
                    managers={ myTasks && myTasks.managers || [] }
                    saveNewOrderTask={ this.saveOrderTask }
                    orderTasks={ myTasks && myTasks.orderTasks || [] }
                />
            </Layout>
        ) : (
            <Spinner spin={ spinner } />
        );
    }
}

export default MyTasksPage;
