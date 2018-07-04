// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Radio } from 'antd';

// proj
import { fetchOrders, setOrdersDaterangeFilter } from 'core/orders/duck';
import { fetchUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';
import { setModal, MODALS } from 'core/modals/duck';

import { Layout } from 'commons';
import {
    OrdersContainer,
    FunelContainer,
    OrdersFilterContainer,
    UniversalFilters,
} from 'containers';
import book from 'routes/book';
import { getDaterange } from 'utils';

// own
import Styles from './styles.m.css';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const mapState = state => {
    return {
        ordersDaterangeFilter: state.orders.filter.daterange,
        filter:                state.orders.filter,
        collapsed:             state.ui.get('collapsed'),
        // orderComments:         state.forms.universalFiltersForm.orderComments,
    };
};

const mapDispatch = {
    fetchOrders,
    setOrdersDaterangeFilter,
    setModal,
    fetchUniversalFiltersForm,
};

@withRouter
@connect(mapState, mapDispatch)
class OrdersPage extends Component {
    // componentDidMount() {
    //     const status = this.props.match.params.ordersStatuses;
    //     const { fetchUniversalFiltersForm } = this.props;
    //
    //     if (status === 'cancel') {
    //         fetchUniversalFiltersForm();
    //     }
    // }
    //
    // componentDidUpdate(prevProps) {
    //     const status = this.props.match.params.ordersStatuses;
    //     const { orderComments, fetchUniversalFiltersForm } = this.props;
    //
    //     if (status === 'cancel') {
    //         console.log('→ UPDATE');
    //         console.log('→ prevProps.orderComments', prevProps.orderComments);
    //         console.log('→ orderComments', orderComments);
    //         if (!orderComments) {
    //             console.log('→ UPDATE 2');
    //             fetchUniversalFiltersForm();
    //         } else if (prevProps.orderComments === orderComments) {
    //             console.log('→ UPDATE 3');
    //         }
    //     }
    // }

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
            case 'cancel':
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
        const { collapsed } = this.props;

        const status = this.props.match.params.ordersStatuses;

        return (
            <Layout
                paper={ false }
                title={ this.getPageTitle() }
                description={ <FormattedMessage id='orders-page.description' /> }
                controls={
                    <div className={ Styles.controls }>
                        { [ 'success', 'cancel' ].indexOf(status) < 0 && (
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
                        ) }
                        <div className={ Styles.buttonGroup }>
                            { (status === 'cancel' || status === 'success') && (
                                <Button
                                    type='primary'
                                    onClick={ () =>
                                        this.props.setModal(MODALS.INVITE)
                                    }
                                >
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
                    <OrdersFilterContainer
                        status={ status }
                        orderComments={ this.props.orderComments }
                    />
                </section>
                { (status === 'success' || status === 'cancel') && (
                    <section
                        className={ `${Styles.universalFilters} ${collapsed &&
                            Styles.universalFiltersCollapsed}` }
                    >
                        <UniversalFilters />
                    </section>
                ) }
                <section
                    className={
                        [ 'success', 'cancel' ].indexOf(status) > -1
                            ? `${Styles.ordersWrrapper} ${
                                Styles.ordersWrrapperUF
                            }`
                            : Styles.ordersWrrapper
                    }
                >
                    <OrdersContainer />
                </section>
            </Layout>
        );
    }
}

export default OrdersPage;
