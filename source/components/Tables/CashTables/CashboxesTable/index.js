// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
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

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export class CashboxesTable extends Component {
    constructor(props) {
        super(props);

        this.columns = columnsConfig({
            deleteCashbox,
            formatMessage: props.intl.formatMessage,
        });
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
                pagination={ false }
                locale={ {
                    emptyText: <FormattedMessage id='no_data' />,
                } }
            />
        );
    }
}
