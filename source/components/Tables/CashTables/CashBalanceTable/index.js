// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Table } from 'antd';
import moment from 'moment';

// proj
import { fetchCashboxesBalance } from 'core/cash/duck';

import { DatePickerField } from 'forms/_formkit';
import { ResponsiveView } from 'commons';
import { BREAKPOINTS } from 'utils';

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    data: state.cash.balance,
});

const mapDispatchToProps = {
    fetchCashboxesBalance,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export class CashBalanceTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig();
    }

    componentDidMount() {
        this.props.fetchCashboxesBalance();
    }

    _handleDatepicker = val => console.log('→ value', val);

    render() {
        const { cashboxesFetching, data } = this.props;

        return (
            <div className={ Styles.tableWrapper }>
                <div className={ Styles.tableHead }>
                    <ResponsiveView
                        view={ { min: BREAKPOINTS.xxl.min, max: null } }
                    >
                        <h3 className={ Styles.tableHeadText }>
                            <FormattedMessage id='cash-table.leftovers' />
                        </h3>
                    </ResponsiveView>
                    <DatePickerField
                        date={ moment() }
                        onChange={ this._handleDatepicker }
                    />
                </div>
                <Table
                    className={ Styles.table }
                    size='small'
                    columns={ this.columns }
                    dataSource={ data }
                    loading={ cashboxesFetching }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </div>
        );
    }
}
