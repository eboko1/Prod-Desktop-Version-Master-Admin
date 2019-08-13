// vendor
import React from 'react';
import { connect } from 'react-redux';
import { Input } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import { Catcher } from 'commons';
import { permissions, isForbidden } from 'utils';

// own
const Search = Input.Search;

const SearchWrapper = styled.div`
    width: ${props => props.width ? props.width : 'auto'};
`;

const SearchField = props => {
    const handleSearch = _.debounce(value => {
        props.setFilters({ query: value });
        // props.fetchData({ sort: { page: 1 }, ...props.filter });
    }, 1000);

    return (
        <Catcher>
            <SearchWrapper width={ props.width }>
                <Search
                    disabled={ isForbidden(
                        props.user,
                        permissions.SEARCH_STORE_PRODUCT,
                    ) }
                    placeholder={ props.intl.formatMessage({
                        id: 'storage.search',
                    }) }
                    onChange={ ({ target: { value } }) => handleSearch(value) }
                />
            </SearchWrapper>
        </Catcher>
    );
};

const mapStateToProps = state => ({
    user: state.auth,
});

export default injectIntl(connect(mapStateToProps)(SearchField));
