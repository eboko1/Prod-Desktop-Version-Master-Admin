// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table } from 'antd';
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

        const { initialSettingSalaries } = props;
        this.uuid = _.isArray(initialSettingSalaries)
            ? initialSettingSalaries.length
            : 0;
        const keys = _.isArray(initialSettingSalaries)
            ? _.keys(initialSettingSalaries)
            : [];

        this.state = { keys: [ ...keys, this.uuid++ ] };
    }

    componentDidUpdate(prevProps) {
        if (
            !_.isEqual(
                this.props.initialSettingSalaries,
                prevProps.initialSettingSalaries,
            )
        ) {
            const { initialSettingSalaries } = this.props;
            this.uuid = _.isArray(initialSettingSalaries)
                ? initialSettingSalaries.length
                : 0;
            const keys = _.isArray(initialSettingSalaries)
                ? _.keys(initialSettingSalaries)
                : [];

            this.setState({ keys: [ ...keys, this.uuid++ ] });
        }
    }

    remove = key => {
        const keys = this.state.keys;
        this.setState({ keys: keys.filter(value => value !== key) });
    };

    add = () => {
        const keys = this.state.keys;
        this.setState({ keys: [ ...keys, this.uuid++ ] });
    };

    render() {
        const {
            initialSettingSalaries,
            form,
            user,
            createSalary,
            updateSalary,
            deleteSalary,
        } = this.props;
        const { formatMessage } = this.props.intl;
        const { keys } = this.state;

        const columns = columnsConfig(
            formatMessage,
            form,
            initialSettingSalaries,
            createSalary,
            updateSalary,
            deleteSalary,
            user,
        );

        return (
            <Catcher>
                <Table
                    rowClassName={ ({ key }) => {
                        const wasEdited = _.get(this.props.fields, [ 'settingSalaries', key ]);
                        const exists = _.get(initialSettingSalaries, [ key ]);

                        if (!exists) {
                            return Styles.newSalaryRow;
                        } else if (wasEdited) {
                            return Styles.editedSalaryRow;
                        }
                    } }
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
            </Catcher>
        );
    }
}
