// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Table } from 'antd';

// proj
import { fetchCashboxes, deleteCashbox } from 'core/cash/duck';

// own
import { columnsConfig } from './config';

const mapStateToProps = state => ({
    cashboxes: state.cash.cashboxes,
});

const mapDispatchToProps = {
    fetchCashboxes,
    deleteCashbox,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export class CashboxesTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig({ deleteCashbox });
    }

    componentDidMount() {
        this.props.fetchCashboxes();
    }

    render() {
        const { cashboxesFetching, cashboxes } = this.props;

        return (
            <Table
                size='small'
                columns={ this.columns }
                dataSource={ cashboxes }
                loading={ cashboxesFetching }
                locale={ {
                    emptyText: <FormattedMessage id='no_data' />,
                } }
            />
        );
    }
}
