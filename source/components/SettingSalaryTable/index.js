// vendor
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Table, Icon, Rate, Radio, Button } from 'antd';
import moment from 'moment';
import { v4 } from 'uuid';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import book from 'routes/book';
import { permissions, isForbidden } from 'utils';

// own
import { columnsConfig } from './settingSalaryTableConfig';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@withRouter
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
        const { user, saveSalary } = this.props;
        const { keys } = this.state;
        console.log(user);
        const columns = columnsConfig(user, saveSalary);

        return (
            <Catcher>
                <Table
                    dataSource={ keys.map(key => ({ key })) }
                    columns={ columns }
                    scroll={ { x: 840 } }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
                <Button
                    onClick={ () => this._handleAdd() }>
                    Click me
                </Button>
            </Catcher>
        );
    }
}
