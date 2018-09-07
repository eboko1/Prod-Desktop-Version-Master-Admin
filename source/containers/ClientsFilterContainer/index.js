// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Input } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';

// proj
import { fetchOrders, setClientsSearchFilter } from 'core/orders/duck';
import { fetchUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';

import { Catcher } from 'commons';
import { StatsCountsPanel } from 'components';

// own
import Styles from './styles.m.css';
const Search = Input.Search;

const mapStateToProps = state => {
    return {
        stats:  state.clients.stats,
        filter: state.clients.filter,
    };
};

const mapDispatchToProps = {
    fetchOrders,
    setClientsSearchFilter,
    fetchUniversalFiltersForm,
};

@withRouter
@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class OrdersFilterContainer extends Component {
    constructor(props) {
        super(props);
        this.handleClientsSearch = _.debounce(value => {
            const { setClientsSearchFilter, fetchClients, filter } = this.props;
            setClientsSearchFilter(value);
            fetchClients({ page: 1, ...filter });
        }, 1000);
    }

    componentDidMount() {
        this.props.fetchUniversalFiltersForm();
    }

    render() {
        const { stats, intl } = this.props;

        return (
            <Catcher>
                <div className={ Styles.filter }>
                    <StatsCountsPanel stats={ stats } />
                    <Search
                        className={ Styles.search }
                        placeholder={ intl.formatMessage({
                            id: 'orders-filter.search_placeholder',
                        }) }
                        onChange={ ({ target: { value } }) =>
                            this.handleClientsSearch(value)
                        }
                    />
                </div>
            </Catcher>
        );
    }
}
