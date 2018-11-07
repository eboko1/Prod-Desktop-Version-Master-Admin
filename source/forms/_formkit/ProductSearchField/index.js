// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Select, Spin } from 'antd';
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';

// proj
import { setProductSearchQuery } from 'core/search/duck';

// own
const Option = Select.Option;

const mapStateToProps = state => ({
    products:           state.search.products,
    isFetchingProducts: state.search.isFetchingProducts,
});

const mapDispatchToProps = {
    setProductSearchQuery,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ProductSearchField extends Component {
    render() {
        const { onSelect, setProductSearchQuery } = this.props;
        const { products, isFetchingProducts, productId } = this.props;

        return (
            <Select
                placeholder={ this.props.intl.formatMessage({
                    id: 'product_placeholder',
                }) }
                style={ this.props.selectStyles }
                showSearch
                allowClear
                filterOption={ false }
                notFoundContent={
                    isFetchingProducts ? (
                        <Spin size='small' />
                    ) : (
                        <FormattedMessage id='not_found' />
                    )
                }
                onSearch={ item => setProductSearchQuery(item) }
                onChange={ productId => onSelect(productId) }
                value={ productId }
            >
                { isFetchingProducts
                    ? []
                    : products.map(({ productId, name }) => (
                        <Option key={ productId } value={ productId }>
                            { name }
                        </Option>
                    )) }
            </Select>
        );
    }
}
