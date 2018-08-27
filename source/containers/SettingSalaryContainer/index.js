// vendor
import React, { Component } from 'react';
import { Button, Form} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';


// proj
import { withReduxForm } from 'utils';
import {fetchSalary, saveSalary} from 'core/settingSalary/duck'
import { Catcher } from 'commons';
import {DecoratedDatePicker} from 'forms/DecoratedFields/DecoratedDatePicker'
import SettingSalaryTable from 'components/SettingSalaryTable'

// own

import Styles from './styles.m.css'
const mapStateToProps = state => {
    return {
        salaries:  state.settingSalary.salaries,
        employees: state.employee.employees,
    };
};

const mapDispatchToProps = {
    fetchSalary,
    saveSalary,
};

const FormItem = Form.Item;

@injectIntl
@withReduxForm({actions: mapDispatchToProps, mapStateToProps})
export default class SettingSalaryContainer extends Component {
    constructor(props) {
        super(props);

    }   


    componentDidMount(){
        this.props.fetchSalary()
    }
    /* eslint-enable complexity */

    render() {
        const {saveSalary, salaries, employees}=this.props

        return (
            <Catcher>
                <div className={ Styles.downloadFile }>
                    <DecoratedDatePicker
                        ranges
                        field='birthday'
                        label={
                            null                        }
                        formItem
                        formatMessage={
                            this.props.intl.formatMessage
                        }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        value={ null }
                        getCalendarContainer={ trigger =>
                            trigger.parentNode
                        }
                        format='YYYY-MM-DD'
                    />
                    <FormItem>
                        <Button>
                            <FormattedMessage id='setting-salary.calculate'/>
                        </Button>
                    </FormItem>
                </div>
                <div>
                    <SettingSalaryTable
                        salaries={ salaries }
                        saveSalary={ saveSalary }
                        employees={ employees }/>
                </div> 
            </Catcher>
        );
    }
}
