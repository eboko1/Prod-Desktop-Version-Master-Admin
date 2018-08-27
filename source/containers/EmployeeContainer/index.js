// vendor
import React, { Component } from 'react';
import { Tabs } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';


// proj

import { fetchEmployee} from 'core/employee/duck';
import { initEmployeeForm} from 'core/forms/employeeForm/duck';
import { Catcher } from 'commons';
import EmployeeTable from 'components/EmployeeTable'
import SettingSalaryContainer from 'containers/SettingSalaryContainer'

// own
import Styles from './styles.m.css';

const TabPane = Tabs.TabPane;
const mapStateToProps = state => {
    return {
        employees: state.employee.employees,

    };
};

const mapDispatchToProps = {

    fetchEmployee,
    initEmployeeForm,
};


@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class EmployeeContainer extends Component {
    constructor(props) {
        super(props);

    }   


    componentDidMount(){
        this.props.fetchEmployee({kind: 'all'})
    }
    
    /* eslint-enable complexity */
    render() {
        const { employees, initEmployeeForm } = this.props;
        // const { sortField, sortArrow } = this.state;

        return (
            <Catcher>
                <Tabs type='card' onChange={ (active)=>{
                    this.props.fetchEmployee({kind: active})
                } }>
                    <TabPane
                        tab={
                            this.props.intl.formatMessage({
                                id: 'employee-page.all',
                            })
                        }
                        key='all'
                    >
                        <section className={ Styles.myTasks }>
                            <EmployeeTable
                                initEmployeeForm={ initEmployeeForm } 
                                employees={ employees }/>
                        </section>
                    </TabPane>
                    <TabPane
                        tab={
                            this.props.intl.formatMessage({
                                id: 'employee-page.workers',
                            })
                        }
                        key='workers'
                    >
                        <section className={ Styles.myTasks }>
                            <EmployeeTable 
                                initEmployeeForm={ initEmployeeForm } 
                                employees={ employees }/>

                        </section>
                    </TabPane>
                    <TabPane
                        tab={
                            this.props.intl.formatMessage({
                                id: 'employee-page.dismissed',
                            })
                        }
                        key='disabled'
                    >
                        <section className={ Styles.myTasks }>
                            <EmployeeTable
                                initEmployeeForm={ initEmployeeForm } 
                                employees={ employees }/>
                        </section>
                    </TabPane>
                    
                    <TabPane
                        tab={
                            this.props.intl.formatMessage({
                                id: 'employee-page.setting_salary',
                            })
                        }
                        key='settingSalary'
                    >
                        <section >
                            <SettingSalaryContainer/>
                        </section>
                    </TabPane>
                </Tabs>
                
            </Catcher>
        );
    }
}
