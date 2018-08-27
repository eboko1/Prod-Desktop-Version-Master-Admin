// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Spin } from 'antd';
import { injectIntl } from 'react-intl';

// own
import { setBusinessSearchQuery } from 'core/search/duck';

const mapDispatchToProps = {
    setBusinessSearchQuery,
};

const Option = Select.Option;

const mapStateToProps = state => ({
    businesses:           state.search.businesses,
    isFetchingBusinesses: state.search.isFetchingBusinesses,
});

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class BusinessSearchContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { onSelect, setBusinessSearchQuery } = this.props;
        const { businesses, isFetchingBusinesses, businessId } = this.props;

        return (
            <Select
                showSearch
                allowClear
                filterOption={ false }
                notFoundContent={
                    isFetchingBusinesses ? <Spin size='small' /> : 'Not found'
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
