// vendor
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Button, Input, Radio, Icon, Slider, Select } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Catcher } from 'commons';
import Styles from './styles.m.css';
import { v4 } from 'uuid';

// proj
import {
    ordersSearch,
    fetchOrders,
    setOrdersStatusFilter,
    setOrdersSearchFilter,
    setOrdersNPSFilter,
    setOrdersCancelReasonFilter,
} from 'core/orders/duck';

import { fetchUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';

// own
const Search = Input.Search;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const mapStateToProps = state => {
    return {
        stats:         state.orders.stats,
        filter:        state.orders.filter,
        orderComments: state.forms.universalFiltersForm.orderComments,
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            ordersSearch,
            fetchOrders,
            setOrdersStatusFilter,
            setOrdersSearchFilter,
            setOrdersNPSFilter,
            fetchUniversalFiltersForm,
            setOrdersCancelReasonFilter,
        },
        dispatch,
    );
};

@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class OrdersFilterContainer extends Component {
    constructor(props) {
        super(props);
        this.handleOrdersSearch = _.debounce(value => {
            const { setOrdersSearchFilter, fetchOrders, filter } = this.props;
            setOrdersSearchFilter(value);
            fetchOrders({ page: 1, ...filter });
        }, 1000);
    }

    componentDidMount() {
        const status = this.props.match.params.ordersStatuses;
        const { fetchUniversalFiltersForm } = this.props;

        if (status === 'cancel') {
            fetchUniversalFiltersForm();
        }
    }

    componentDidUpdate() {
        const status = this.props.match.params.ordersStatuses;
        const { orderComments, fetchUniversalFiltersForm } = this.props;
        // TODO check []
        if (status === 'cancel') {
            if (!orderComments) {
                fetchUniversalFiltersForm();
            }
        }
    }

    selectStatus(ev) {
        const { setOrdersStatusFilter, fetchOrders, filter } = this.props;

        setOrdersStatusFilter(ev.target.value);
        fetchOrders({ page: 1, ...filter });
    }

    handleReviewSlider = value => {
        const { setOrdersNPSFilter, fetchOrders, filter } = this.props;

        setOrdersNPSFilter({ minNps: value[ 0 ], maxNps: value[ 1 ] });
        fetchOrders({ page: 1, ...filter });
    };

    handleCancelReasonSelect = value => {
        const { setOrdersCancelReasonFilter, fetchOrders, filter } = this.props;

        setOrdersCancelReasonFilter(value);
        fetchOrders({ page: 1, ...filter });
    };

    render() {
        const { status, stats, intl, filter, orderComments } = this.props;

        // const mid = ((max - min) / 2).toFixed(5);
        // const preColor = value >= mid ? '' : 'rgba(0, 0, 0, .45)';
        // const nextColor = value >= mid ? 'rgba(0, 0, 0, .45)' : '';

        const marks = {
            0: {
                style: {
                    color: 'rgb(255, 126, 126)',
                },
                label: <strong>0</strong>,
            },
            1: {
                style: {
                    color: 'rgb(255, 126, 126)',
                },
                label: 1,
            },
            2: {
                style: {
                    color: 'rgb(255, 126, 126)',
                },
                label: 2,
            },
            3: {
                style: {
                    color: 'rgb(255, 126, 126)',
                },
                label: 3,
            },
            4: {
                style: {
                    color: 'rgb(255, 126, 126)',
                },
                label: 4,
            },
            5: {
                style: {
                    color: 'rgb(255, 126, 126)',
                },
                label: 5,
            },
            6: {
                style: {
                    color: 'rgb(255, 126, 126)',
                },
                label: 6,
            },
            7: {
                style: {
                    color: 'rgb(251, 158, 62)',
                },
                label: 7,
            },
            8: {
                style: {
                    color: 'rgb(251, 158, 62)',
                },
                label: 8,
            },
            9: {
                style: {
                    color: 'rgb(76, 201, 105)',
                },
                label: 9,
            },
            10: {
                style: {
                    color: 'rgb(76, 201, 105)',
                },
                label: <strong>10</strong>,
            },
        };

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
                        onChange={({ target: { value } }) =>
                            this.handleOrdersSearch(value)
                        }
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
                            <RadioButton value='not_complete,required,call'>
                                <FormattedMessage id='all' /> ({ stats.not_complete +
                                    stats.required +
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
                            <RadioButton value='call'>
                                <FormattedMessage id='call' /> ({ stats.call })
                            </RadioButton>
                        </RadioGroup>
                    ) }
                    { status === 'approve' && (
                        <RadioGroup
                            onChange={ ev => this.selectStatus(ev) }
                            className={ Styles.buttonGroup }
                            defaultValue={ 'approve,reserve' } // filter.status
                        >
                            <RadioButton value='approve,reserve'>
                                <FormattedMessage id='all' /> ({ stats.approve +
                                    stats.reserve })
                            </RadioButton>
                            <RadioButton value='approve'>
                                <FormattedMessage id='approve' /> ({
                                    stats.approve
                                })
                            </RadioButton>
                            <RadioButton value='reserve'>
                                <FormattedMessage id='reserve' /> ({
                                    stats.reserve
                                })
                            </RadioButton>
                        </RadioGroup>
                    ) }
                    { status === 'reviews' && (
                        <div className={ Styles.review }>
                            { /* <Icon style={ { color: preColor } } type='frown-o' /> */ }
                            { /* <div>NPS:</div> */ }
                            <Slider
                                range
                                defaultValue={ [ 0, 10 ] }
                                min={ 0 }
                                max={ 10 }
                                // value={ filter.nps }
                                onChange={ value =>
                                    this.handleReviewSlider(value)
                                }
                                marks={ marks }
                            />
                            { /* <Icon style={ { color: nextColor } } type='smile-o' /> */ }
                        </div>
                    ) }
                    { status === 'cancel' &&
                        orderComments && (
                        <Select
                            className={ Styles.cancelReasonSelect }
                            getPopupContainer={ trigger =>
                                trigger.parentNode
                            }
                            // mode='multiple'
                            placeholder={
                                <FormattedMessage id='orders-filter.filter_by_cancel_reason' />
                            }
                            onChange={ value =>
                                this.handleCancelReasonSelect(value)
                            }
                        >
                            { orderComments
                                .map(
                                    ({ status, id, comment }) =>
                                        status === 'cancel' ? (
                                            <Option value={ id } key={ v4() }>
                                                { comment }
                                            </Option>
                                        ) : 
                                            false
                                    ,
                                )
                                .filter(Boolean) }
                        </Select>
                    ) }
                </div>
            </Catcher>
        );
    }
}
