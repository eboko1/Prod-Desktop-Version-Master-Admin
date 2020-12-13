// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Radio } from 'antd';
import classNames from 'classnames/bind';
import moment from 'moment';

// proj
import {
    fetchOrders,
    setOrdersDaterangeFilter,
    setUniversalFilter,
} from 'core/orders/duck';
import { fetchUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';
import { setModal, MODALS } from 'core/modals/duck';

import { Layout } from 'commons';
import {
    OrdersContainer,
    FunelContainer,
    OrdersFilterContainer,
    UniversalFilters,
} from 'containers';
import { StorageDateFilter } from 'components';
import book from 'routes/book';
import { withResponsive, getDaterange, permissions, isForbidden } from 'utils';

// own
import Styles from './styles.m.css';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

let cx = classNames.bind(Styles);

const mapState = state => ({
    ordersDaterangeFilter: state.orders.filter.daterange,
    filter:                state.orders.filter,
    universalStats:        state.orders.universalStats,
    universalFilter:       state.orders.universalFilter,
    collapsed:             state.ui.collapsed,
    user:                  state.auth,
    daterange:             state.orders.daterange,
    // isMobile:              state.ui.views.isMobile,
});

const mapDispatch = {
    fetchOrders,
    setOrdersDaterangeFilter,
    setModal,
    fetchUniversalFiltersForm,
    setUniversalFilter,
};

@withRouter
@connect(
    mapState,
    mapDispatch,
)
@withResponsive()
export default class OrdersPage extends Component {
    _getPageTitle() {
        const status = this.props.match.params.ordersStatuses;
        switch (status) {
            case 'appointments':
                return <FormattedMessage id='appointments' />;
            case 'approve':
                return <FormattedMessage id='records' />;
            case 'progress':
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

    _setOrdersDaterange = daterange => {
        const { setOrdersDaterangeFilter, fetchOrders } = this.props;

        setOrdersDaterangeFilter({
            daterange,
            startDate: moment(daterange[0]).format('YYYY-MM-DD'),
            endDate: moment(daterange[1]).format('YYYY-MM-DD'),
        });
        fetchOrders();
    };
    // eslint-disable-next-line
    render() {
        const { collapsed, isMobile, user } = this.props;

        const headerControls = this._renderHeaderContorls();

        const status = this.props.match.params.ordersStatuses;

        let funelSectionStyles = cx({
            funelWithFilters:          true,
            funelWithFiltersCollapsed: collapsed,
            funelWithFiltersShadow:    [ 'success', 'cancel' ].indexOf(status) < 0,
            funelMobile:               isMobile,
        });
        return (
            <Layout
                paper={ false }
                title={ this._getPageTitle() }
                description={ <FormattedMessage id='orders-page.description' /> }
                controls={
                    <div className={ Styles.controls }>
                        { !isMobile &&
                            /*([ 'success', 'cancel', 'reviews' ].indexOf(status) <
                                0 &&*/
                                headerControls }
                        <div className={ Styles.buttonGroup }>
                            { (status === 'cancel' || status === 'success') && (
                                <Button
                                    type='primary'
                                    disabled={
                                        isForbidden(
                                            user,
                                            permissions.CREATE_ORDER,
                                        ) ||
                                        isForbidden(
                                            user,
                                            permissions.CREATE_INVITE_ORDER,
                                        )
                                    }
                                    onClick={ () =>
                                        this.props.setModal(MODALS.INVITE)
                                    }
                                >
                                    <FormattedMessage id='orders-page.invite_to_service' />
                                </Button>
                            ) }
                            <Link
                                to={ {
                                    pathname: book.addOrder,
                                    state:    {
                                        beginDatetime: moment().add( (30 - (moment().minute() % 30)) , "minutes").format('YYYY-MM-DD HH:00'),
                                    },
                                } }
                            >
                                <Button
                                    type='primary'
                                    disabled={ isForbidden(
                                        user,
                                        permissions.CREATE_ORDER,
                                    ) }
                                >
                                    <FormattedMessage id='orders-page.add_appointment' />
                                </Button>
                            </Link>
                        </div>
                    </div>
                }
            >
                <section className={ funelSectionStyles }>
                    <FunelContainer />
                    <OrdersFilterContainer status={ status } />
                </section>
                { (status === 'success' || status === 'cancel') && (
                    <section
                        className={ `${Styles.universalFilters} ${collapsed &&
                            Styles.universalFiltersCollapsed}` }
                    >
                        <UniversalFilters
                            areFiltersDisabled={ isForbidden(
                                this.props.user,
                                permissions.SHOW_FILTERS,
                            ) }
                            stats={ this.props.universalStats }
                            universalFilter={ this.props.universalFilter }
                            setUniversalFilter={ this.props.setUniversalFilter }
                        />
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

    _renderHeaderContorls = () => {
        // const {
        //     filter: { daterange },
        // } = this.props;

        return (
            <StorageDateFilter
                dateRange={this.props.daterange}
                onDateChange={ this._setOrdersDaterange }
                minimize
            />
        );
    };
}
