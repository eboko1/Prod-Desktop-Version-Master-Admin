// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Table } from 'antd';
import _ from 'lodash';

// proj
import {
    fetchCashboxesActivity,
    setCashAccountingFilters,
    selectCashAccountingFilters,
} from 'core/cash/duck';

import { RangePickerField } from 'forms/_formkit';
import { ResponsiveView } from 'commons';
import { BREAKPOINTS } from 'utils';

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';
import moment from 'moment';

const mapStateToProps = state => ({
    data:    state.cash.activity,
    filters: selectCashAccountingFilters(state),
});

const mapDispatchToProps = {
    fetchCashboxesActivity,
    setCashAccountingFilters,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export class CashActivityTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig();
    }

    componentDidMount() {
        this.props.fetchCashboxesActivity();
    }

    _onDateRangeChange = value => {
        const normalizedValue = value.map(date => date.format('YYYY-MM-DD'));
        const daterange = {
            startDate: normalizedValue[ 0 ],
            endDate:   normalizedValue[ 1 ],
        };
        this.props.setCashAccountingFilters(daterange);
        this.props.fetchCashboxesActivity();
    };

    render() {
        const { cashboxesFetching, data, filters } = this.props;

        return (
            <div className={ Styles.tableWrapper }>
                <div className={ Styles.tableHead }>
                    <ResponsiveView
                        view={ { min: BREAKPOINTS.xxl.min, max: null } }
                    >
                        <h3 className={ Styles.tableHeadText }>
                            <FormattedMessage id='cash-table.trace' />
                        </h3>
                    </ResponsiveView>
                    <RangePickerField
                        onChange={ this._onDateRangeChange }
                        // loading={ loading }
                        startDate={ _.get(filters, 'startDate') }
                        endDate={ _.get(filters, 'endDate') }
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
