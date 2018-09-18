// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Input, Radio, Slider, Select } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
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
import {
    fetchUniversalFiltersForm,
    clearUniversalFilters,
} from 'core/forms/universalFiltersForm/duck';

import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
const Search = Input.Search;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const mapStateToProps = state => ({
    stats:         state.orders.stats,
    filter:        state.orders.filter,
    orderComments: state.forms.universalFiltersForm.filters.orderComments,
    currentStatus: _.get(state, 'router.location.state.status'),
});

const mapDispatchToProps = {
    ordersSearch,
    fetchOrders,
    setOrdersStatusFilter,
    setOrdersSearchFilter,
    setOrdersNPSFilter,
    fetchUniversalFiltersForm,
    setOrdersCancelReasonFilter,
    clearUniversalFilters,
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
        this.handleOrdersSearch = _.debounce(value => {
            const { setOrdersSearchFilter, fetchOrders, filter } = this.props;
            setOrdersSearchFilter(value);
            fetchOrders({ page: 1, ...filter });
        }, 1000);

        this.handleReviewSlider = _.debounce(value => {
            const { setOrdersNPSFilter, fetchOrders, filter } = this.props;

            setOrdersNPSFilter({ minNps: value[ 0 ], maxNps: value[ 1 ] });
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

    componentDidUpdate(prevProps) {
        const status = this.props.match.params.ordersStatuses;
        const {
            orderComments,
            fetchUniversalFiltersForm,
            currentStatus,
        } = this.props;
        // TODO check []
        if (prevProps.currentStatus !== this.props.currentStatus) {
            this.props.setOrdersStatusFilter(currentStatus);
        }
        // if (prevProps.filter.status !== this.props.filter.status) {
        //     this.props.setOrdersStatusFilter(currentStatus);
        // }
        if (status === 'cancel') {
            if (!orderComments) {
                fetchUniversalFiltersForm();
            }
        }
    }

    handleCancelReasonSelect = value => {
        const { setOrdersCancelReasonFilter, fetchOrders, filter } = this.props;

        setOrdersCancelReasonFilter(value);
        fetchOrders({ page: 1, ...filter });
    };

    _setFilterStatus = status => {
        this.props.setOrdersStatusFilter(status);
        this.props.fetchOrders();
    };

    render() {
        const { status, stats, intl, filter, orderComments } = this.props;
        const filterStatus = filter.status;

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
                            className={ Styles.buttonGroup }
                            value={ filterStatus }
                        >
                            <RadioButton
                                value='not_complete,required,call'
                                onClick={ () =>
                                    this._setFilterStatus(
                                        'not_complete,required,call',
                                    )
                                }
                            >
                                <FormattedMessage id='all' /> (
                                { stats.not_complete +
                                    stats.required +
                                    stats.call }
                                )
                            </RadioButton>
                            <RadioButton
                                value='not_complete'
                                onClick={ () =>
                                    this._setFilterStatus('not_complete')
                                }
                            >
                                <FormattedMessage id='not_complete' /> (
                                { stats.not_complete })
                            </RadioButton>
                            <RadioButton
                                value='required'
                                onClick={ () =>
                                    this._setFilterStatus('required')
                                }
                            >
                                <FormattedMessage id='required' /> (
                                { stats.required })
                            </RadioButton>
                            <RadioButton
                                value='call'
                                onClick={ () => this._setFilterStatus('call') }
                            >
                                <FormattedMessage id='call' /> ({ stats.call })
                            </RadioButton>
                        </RadioGroup>
                    ) }
                    { status === 'approve' && (
                        <RadioGroup value={ filterStatus }>
                            <RadioButton
                                value='approve,reserve'
                                onClick={ () =>
                                    this._setFilterStatus('approve,reserve')
                                }
                            >
                                <FormattedMessage id='all' />(
                                { stats.approve + stats.reserve })
                            </RadioButton>
                            <RadioButton
                                value='approve'
                                onClick={ () => this._setFilterStatus('approve') }
                            >
                                <FormattedMessage id='approve' />(
                                { stats.approve })
                            </RadioButton>
                            <RadioButton
                                value='reserve'
                                onClick={ () => this._setFilterStatus('reserve') }
                            >
                                <FormattedMessage id='reserve' />(
                                { stats.reserve })
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
                                <FormattedMessage id='orders-filter.filter_by_refusal_reason' />
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
