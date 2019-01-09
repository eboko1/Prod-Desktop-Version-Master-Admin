// vendor
import React, { Component } from 'react';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

// proj
import { setCashOrdersFilters, fetchCashOrders } from 'core/cash/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Layout, Paper, StyledButton } from 'commons';
import { CashOrderModal } from 'modals';
import { CashOrdersFiltersForm } from 'forms';
import { CashOrdersTable } from 'components';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    collapsed:  state.ui.collapsed,
    cashOrders: state.cash.cashOrders,
    stats:      state.cash.stats,
    modal:      state.modals.modal,
});

const mapDispatchToProps = {
    setModal,
    resetModal,
    setCashOrdersFilters,
    fetchCashOrders,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class CashOrdersPage extends Component {
    render() {
        const {
            collapsed,
            stats,
            modal,
            setModal,
            resetModal,
            setCashOrdersFilters,
            fetchCashOrders,
        } = this.props;

        return (
            <Layout
                title={ <FormattedMessage id='navigation.cash_orders' /> }
                controls={
                    <div className={ Styles.buttonGroup }>
                        <Icon type='printer' className={ Styles.printIcon } />
                        <StyledButton
                            type='secondary'
                            onClick={ () => setModal(MODALS.CASH_ORDER) }
                        >
                            <FormattedMessage id='add' />
                        </StyledButton>
                    </div>
                }
                paper={ false }
            >
                <section
                    className={ `${Styles.filters} ${collapsed &&
                        Styles.filtersCollapsed}` }
                >
                    <CashOrdersFiltersForm
                        stats={ _.omit(stats, 'totalCount') }
                    />
                </section>
                <Paper className={ Styles.content }>
                    <CashOrdersTable
                        totalCount={ _.get(stats, 'totalCount') }
                        setCashOrdersFilters={ setCashOrdersFilters }
                        fetchCashOrders={ fetchCashOrders }
                    />
                </Paper>
                <CashOrderModal resetModal={ resetModal } visible={ modal } />
            </Layout>
        );
    }
}
