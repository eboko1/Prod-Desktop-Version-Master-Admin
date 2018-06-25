// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Input, Radio, Icon } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Catcher } from 'commons';
import Styles from './styles.m.css';

// proj
import {
    ordersSearch,
    fetchOrders,
    setOrdersStatusFilter,
    setOrdersSearchFilter,
} from 'core/orders/duck';

// own
const Search = Input.Search;
const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const mapStateToProps = state => {
    return {
        stats:  state.orders.stats,
        filter: state.orders.filter,
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            ordersSearch,
            fetchOrders,
            setOrdersStatusFilter,
            setOrdersSearchFilter,
        },
        dispatch,
    );
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class OrdersFilterContainer extends Component {
    handleOrdersSearch(value) {
        const { setOrdersSearchFilter, fetchOrders, filter } = this.props;
        setOrdersSearchFilter(value);
        fetchOrders({ page: 1, ...filter });
    }

    selectStatus(ev) {
        const { setOrdersStatusFilter, fetchOrders, filter } = this.props;

        setOrdersStatusFilter(ev.target.value);
        fetchOrders({ page: 1, ...filter });
    }

    render() {
        const { status, stats, intl, filter } = this.props;

        return (
            <Catcher>
                <div className={ Styles.filter }>
                    <Search
                        className={ Styles.search }
                        placeholder={ intl.formatMessage({
                            id: 'orders-filter.search_placeholder',
                        }) }
                        // placeholder={
                        //     <FormattedMessage id='orders-filter.search.search_placeholder' />
                        // }
                        // eslint-disable-next-line
                        onSearch={value => this.handleOrdersSearch(value)}
                        // onChange={ this.handleOrdersSearch }
                        // enterButton
                        // enterButton={ <Icon type='close' /> }
                    />
                    { status === 'appointments' && (
                        <RadioGroup
                            onChange={ ev => this.selectStatus(ev) }
                            className={ Styles.buttonGroup }
                            defaultValue={ filter.status }
                        >
                            <RadioButton value='not_complete,required,reserve,call'>
                                <FormattedMessage id='all' /> ({ stats.not_complete +
                                    stats.required +
                                    stats.reserve +
                                    stats.call })
                            </RadioButton>
                            <RadioButton value='not_complete'>
                                <FormattedMessage id='not_complete' /> ({
                                    stats.not_complete
                                })
                            </RadioButton>
                            <RadioButton value='required'>
                                <FormattedMessage id='required' /> ({
                                    stats.required
                                })
                            </RadioButton>
                            <RadioButton value='reserve'>
                                <FormattedMessage id='reserve' /> ({
                                    stats.reserve
                                })
                            </RadioButton>
                            <RadioButton value='call'>
                                <FormattedMessage id='call' /> ({ stats.call })
                            </RadioButton>
                        </RadioGroup>
                    ) }
                </div>
            </Catcher>
        );
    }
}
