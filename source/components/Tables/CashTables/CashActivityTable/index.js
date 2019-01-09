// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Table } from 'antd';

// proj
import { fetchCashboxesActivity } from 'core/cash/duck';

import { RangePickerField } from 'forms/_formkit';
import { ResponsiveView } from 'commons';
import { BREAKPOINTS } from 'utils';

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';
import moment from 'moment';

const mapStateToProps = state => ({
    data: state.cash.activity,
});

const mapDispatchToProps = {
    fetchCashboxesActivity,
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

    _onDaterangeChange = val => console.log('→ daterange val', val);

    render() {
        const { cashboxesFetching, data } = this.props;

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
                        onChange={ this._onDaterangeChange }
                        // loading={ loading }
                        startDate={ moment()
                            .startOf('month')
                            .format('YYYY-MM-DD hh:mm') }
                        endDate={ moment().format('YYYY-MM-DD hh:mm') }
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
