// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Table } from 'antd';

// proj
import { fetchCashboxes, deleteCashbox } from 'core/cash/duck';

import { RangePickerField } from 'forms/_formkit';

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    cashboxes: state.cash.cashboxes,
});

const mapDispatchToProps = {
    fetchCashboxes,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export class CashAccountingTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig();
    }

    render() {
        const { cashboxesFetching, cashboxes } = this.props;

        return (
            <div className={ Styles.tableWrapper }>
                <div className={ Styles.tableHead }>
                    <h3 className={ Styles.tableHeadText }>Остатки\Движ</h3>
                    <RangePickerField />
                </div>
                <Table
                    className={ Styles.table }
                    size='small'
                    columns={ this.columns }
                    dataSource={ cashboxes }
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
