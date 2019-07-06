// vendor
import React from 'react';
import { Input } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

// proj

import { Catcher } from 'commons';

// own
const Search = Input.Search;

const SearchField = props => {
    const handleSearch = _.debounce(value => {
        props.setFilters({ query: value });
        // props.fetchData({ sort: { page: 1 }, ...props.filter });
    }, 1000);

    return (
        <Catcher>
            <div>
                <Search
                    placeholder={ props.intl.formatMessage({
                        id: 'orders-filter.search_placeholder',
                    }) }
                    onChange={ ({ target: { value } }) => handleSearch(value) }
                />
            </div>
        </Catcher>
    );
};

export default injectIntl(SearchField);
