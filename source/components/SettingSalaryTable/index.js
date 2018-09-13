// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table, Button } from 'antd';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';

// own
import { columnsConfig } from './settingSalaryTableConfig';
import Styles from './styles.m.css';

@injectIntl
export default class SettingSalaryTable extends Component {
    constructor(props) {
        super(props);
        this.uuid = 0;
        this.state = { keys: [ this.uuid++ ] };
    }

    _getDefaultValue = (key, fieldName) => {
        const salaryField = (this.props.salaryFields || [])[ key ];
        if (!salaryField) {
            return;
        }

        const actions = {
            employeeName:     salaryField.employeeName,
            jobTitle:         salaryField.jobTitle,
            period:           salaryField.period,
            startDate:        salaryField.startDate,
            endDate:          salaryField.endDate,
            ratePerPeriod:    salaryField.ratePerPeriod,
            percentFrom:      salaryField.percentFrom,
            percent:          salaryField.percent,
            considerDiscount: salaryField.considerDiscount,
        };

        return actions[ fieldName ];
    };

    _handleSalaryRowSelect = key => {
        const { keys } = this.state;
        const details = this.props.form.getFieldValue('details');

        if (_.last(keys) === key && !details[ key ].detailName) {
            this._handleAdd();
        }
    };

    _onDelete = redundantKey => {
        const { keys } = this.state;
        this.setState({ keys: keys.filter(key => redundantKey !== key) });
    };

    _handleAdd = () => {
        const { keys } = this.state;
        this.setState({ keys: [ ...keys, this.uuid++ ] });
    };

    render() {
        const { user, saveSalary, getFieldDecorator } = this.props;
        const { formatMessage } = this.props.intl;
        const { keys } = this.state;

        const columns = columnsConfig(
            user,
            saveSalary,
            formatMessage,
            getFieldDecorator,
        );

        return (
            <Catcher>
                <Table
                    className={ Styles.settingSalaryTable }
                    dataSource={ keys.map(key => ({ key })) }
                    columns={ columns }
                    size='small'
                    scroll={ { x: 1000 } }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
                <Button onClick={ () => this._handleAdd() }>Click me</Button>
            </Catcher>
        );
    }
}
