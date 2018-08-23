// vendor
import React, { Component } from 'react';
import { Table, Icon, Tooltip, Tabs } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import { v4 } from 'uuid';

// proj
import { withReduxForm } from 'utils';

import { setModal, MODALS } from 'core/modals/duck';

import { Catcher } from 'commons';
import EmployeeTable from 'components/EmployeeTable'
// own
import Styles from './styles.m.css';


const TabPane = Tabs.TabPane;
@injectIntl
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
                            <EmployeeTable initEmployeeForm={ initEmployeeForm } employees={ employees }/>
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
                            <EmployeeTable initEmployeeForm={ initEmployeeForm }  employees={ employees }/>

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
                            <EmployeeTable initEmployeeForm={ initEmployeeForm }  employees={ employees }/>
                        </section>
                    </TabPane>
                </Tabs>
                
            </Catcher>
        );
    }
}
