// vendor
import React, { Component } from 'react';
import MyTasksContainer from 'containers/MyTasksContainer';
import { connect } from 'react-redux';
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { OrderTaskModal } from 'modals';
import {
    resetOrderTasksForm,
    saveOrderTask,
    changeModalStatus,
} from 'core/forms/orderTaskForm/duck';
import { Layout, Spinner } from 'commons';
const mapStateToProps = state => {
    return {
        myTasks:         state.myTasksContainer.myTasks,
        modal:           state.modals.modal,
        orderTaskEntity: state.forms.orderTaskForm.fields,
        orderTaskId:     state.forms.orderTaskForm.taskId,
        activeOrder:     state.myTasksContainer.activeOrder,
        spinner:         state.ui.get('myTasksFetching'),
    };
};

const mapDispatchToProps = {
    setModal,
    resetModal,
    resetOrderTasksForm,
    saveOrderTask,
    changeModalStatus,
};
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class MyTasksPage extends Component {
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
        const { myTasks, spinner } = this.props;

        return !spinner ? (
            <Layout>
                <MyTasksContainer myTasks={ myTasks } />

                <OrderTaskModal
                    wrappedComponentRef={ this.saveOrderTaskFormRef }
                    orderTaskEntity={ this.props.orderTaskEntity }
                    priorityOptions={ this.props.priorityOptions }
                    progressStatusOptions={ this.props.progressStatusOptions }
                    visible={ this.props.modal }
                    resetModal={ this.props.resetModal }
                    num={ this.props.activeOrder }
                    orderTaskId={ this.props.orderTaskId }
                    orderId={ this.props.activeOrder }
                    resetOrderTasksForm={ this.props.resetOrderTasksForm }
                    stations={
                        this.props.myTasks && this.props.myTasks.stations ||
                        []
                    }
                    managers={
                        this.props.myTasks && this.props.myTasks.managers ||
                        []
                    }
                    saveNewOrderTask={ this.saveOrderTask }
                    orderTasks={
                        this.props.myTasks && this.props.myTasks.orderTasks ||
                        []
                    }
                />
            </Layout>
        ) : (
            <Spinner spin={ spinner } />
        );
    }
}

export default MyTasksPage;
