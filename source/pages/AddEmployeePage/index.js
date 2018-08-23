// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { setModal, resetModal } from 'core/modals/duck';
import { withRouter, Link } from 'react-router-dom';

// proj
import {
    resetOrderTasksForm,
    saveOrderTask,
    changeModalStatus,
} from 'core/forms/orderTaskForm/duck';
import EmployeeContainer from 'containers/EmployeeContainer'
import { Layout, Spinner } from 'commons';
import { fetchEmployee} from 'core/employee/duck';
import book from 'routes/book';

const mapStateToProps = state => {
    return {
        employees:       state.employee.employees,
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
    fetchEmployee,
};
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class AddEmployeePage extends Component {


    /* eslint-disable complexity*/
    render() {
        const {
            spinner,
            employees,
        } = this.props;

        return spinner ? (
            <Spinner spin={ spinner } />
        ) : (
            <Layout    
                title={

                    <>
                        <FormattedMessage
                            id={ 'employee-page.add_employee' }
                        />
                    </>

                }
                // description={
                // <>
                //     <FormattedMessage id='employee-page.description' />
                // </>
                // }
                controls={
                <>
                    <Link to={ book.employeesPage }> <Button                        
                        type='default'
                    >
                        <Icon type='arrow-left' />
                        <FormattedMessage id='back-to-list' />
                        
                    </Button>
                    </Link>
                </>
                }>
                <h1>hello guys i am new page</h1>
            </Layout>
        );
    }
}

export default AddEmployeePage;
