// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Spin } from 'antd';
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';

// proj
import { setBusinessSearchQuery } from 'core/search/duck';

// own
const Option = Select.Option;

const mapStateToProps = state => ({
    businesses:           state.search.businesses,
    isFetchingBusinesses: state.search.isFetchingBusinesses,
});

const mapDispatchToProps = {
    setBusinessSearchQuery,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class BusinessSearchField extends Component {
    render() {
        const { onSelect, setBusinessSearchQuery } = this.props;
        const { businesses, isFetchingBusinesses, businessId } = this.props;

        return (
            <Select
                showSearch
                allowClear
                filterOption={ false }
                notFoundContent={
                    isFetchingBusinesses ? <Spin size='small' /> : <FormattedMessage id='not_found' />
                }
                onSearch={ item => setBusinessSearchQuery(item) }
                onChange={ businessId => onSelect(businessId) }
                value={ businessId }
            >
                { isFetchingBusinesses
                    ? []
                    : businesses.map(({ businessId, name }) => (
                        <Option key={ businessId } value={ businessId }>
                            { name }
                        </Option>
                    )) }
            </Select>
        );
    }
}
