// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Input } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

// proj
import { fetchClients, setClientsSearchFilter } from 'core/clients/duck';
import { fetchUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';

import { Catcher } from 'commons';

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
    fetchClients,
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
            const {
                setClientsSearchFilter,
                fetchClients,
                filter,
                setSearchQuery,
            } = this.props;
            setClientsSearchFilter(value);
            setSearchQuery(value);
            fetchClients({ sort: { page: 1 }, ...filter });
        }, 1000);
    }

    render() {
        return (
            <Catcher>
                <div className={ Styles.filter }>
                    <Search
                        className={ Styles.search }
                        placeholder={ this.props.intl.formatMessage({
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
