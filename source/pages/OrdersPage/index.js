// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Radio } from 'antd';

// proj
import { fetchOrders, setOrdersDaterangeFilter } from 'core/orders/duck';
import {
    OrdersContainer,
    FunelContainer,
    OrdersFilterContainer,
    UniversalFilters,
} from 'containers';

import { Layout } from 'commons';
import book from 'routes/book';
import { getDaterange } from 'utils';

// own
import Styles from './styles.m.css';
const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const mapState = state => {
    return {
        ordersDaterangeFilter: state.orders.filter.daterange,
        filter:                state.orders.filter,
        collapsed:             state.ui.get('collapsed'),
    };
};

const mapDispatch = {
    fetchOrders,
    setOrdersDaterangeFilter,
};

@withRouter
@connect(mapState, mapDispatch)
class OrdersPage extends Component {
    getPageTitle() {
        const status = this.props.match.params.ordersStatuses;
        switch (status) {
            case 'appointments':
                return <FormattedMessage id='appointments' />;
            case 'approved':
                return <FormattedMessage id='records' />;
            case 'in-progress':
                return <FormattedMessage id='repairs' />;
            case 'success':
                return <FormattedMessage id='done' />;
            case 'reviews':
                return <FormattedMessage id='reviews' />;
            case 'invitations':
                return <FormattedMessage id='invitations' />;
            case 'canceled':
                return <FormattedMessage id='cancels' />;

            default:
                return <FormattedMessage id='orders-page.title' />;
        }
    }

    _handleRadioDaterange = event => {
        const daterange = event.target.value;

        if (daterange === 'all') {
            this.props.setOrdersDaterangeFilter({});
        } else if (daterange !== 'all') {
            const daterangeFilter = getDaterange(daterange);
            this.props.setOrdersDaterangeFilter({ ...daterangeFilter });
        }

        this.props.fetchOrders(this.props.filter);
    };

    render() {
        // const { ordersDaterangeFilter } = this.props;
        const { collapsed } = this.props;

        const status = this.props.match.params.ordersStatuses;

        return (
            <Layout
                paper={ false }
                title={ this.getPageTitle() }
                description={ <FormattedMessage id='orders-page.description' /> }
                controls={
                    <div className={ Styles.controls }>
                        <RadioGroup
                            defaultValue='all'
                            // defaultValue={ ordersDaterangeFilter }
                            onChange={ this._handleRadioDaterange }
                            className={ Styles.filters }
                        >
                            <RadioButton value='all'>
                                <FormattedMessage id='orders-page.all' />
                            </RadioButton>
                            <RadioButton value='today'>
                                <FormattedMessage id='orders-page.today' />
                            </RadioButton>
                            <RadioButton value='tomorrow'>
                                <FormattedMessage id='orders-page.tomorrow' />
                            </RadioButton>
                            <RadioButton value='nextWeek'>
                                <FormattedMessage id='orders-page.week' />
                            </RadioButton>
                            <RadioButton value='nextMonth'>
                                <FormattedMessage id='orders-page.month' />
                            </RadioButton>
                        </RadioGroup>
                        <div className={ Styles.buttonGroup }>
                            { (status === 'canceled' ||
                                status === 'success') && (
                                <Button type='primary'>
                                    <FormattedMessage id='orders-page.invite_to_service' />
                                </Button>
                            ) }
                            <Link to={ book.addOrder }>
                                <Button type='primary'>
                                    <FormattedMessage id='orders-page.add_appointment' />
                                </Button>
                            </Link>
                        </div>
                    </div>
                }
            >
                <section
                    className={ `${Styles.funelWithFilters} ${collapsed &&
                        Styles.funelWithFiltersCollapsed}` }
                >
                    <FunelContainer />
                    <OrdersFilterContainer status={ status } />
                </section>
                { (status === 'success' || status === 'canceled') && (
                    <section
                        className={ `${Styles.universalFilters} ${collapsed &&
                            Styles.universalFiltersCollapsed}` }
                    >
                        <UniversalFilters />
                    </section>
                ) }
                <section className={ Styles.ordersWrrapper }>
                    <OrdersContainer />
                </section>
            </Layout>
        );
    }
}

export default OrdersPage;
