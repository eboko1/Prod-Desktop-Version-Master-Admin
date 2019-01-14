// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

// proj
import {
    setCashOrdersFilters,
    fetchCashOrders,
    selectCashOrdersFilters,
} from 'core/cash/duck';
import { clearCashOrderForm } from 'core/forms/cashOrderForm/duck';
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
    modalProps: state.modals.modalProps,
    filters:    selectCashOrdersFilters(state),
});

const mapDispatchToProps = {
    setModal,
    resetModal,
    setCashOrdersFilters,
    fetchCashOrders,
    clearCashOrderForm,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class CashFlowPage extends Component {
    state = {
        cashOrderModalMounted: false,
    };

    componentDidMount() {
        this.props.fetchCashOrders();
    }

    _onOpenCashOrderModal = () => {
        this.props.setModal(MODALS.CASH_ORDER);
        this.setState({ cashOrderModalMounted: true });
    };

    _onCloseCashOrderModal = () => {
        this.props.resetModal();
        this.props.clearCashOrderForm();
        this.setState({ cashOrderModalMounted: false });
    };

    _onOpenPrintCashOrderModal = cashOrderEntity => {
        console.log('→ open printModa cashOrderEntity', cashOrderEntity);
        this.props.setModal(MODALS.CASH_ORDER, {
            printMode:       true,
            editMode:        false,
            cashOrderEntity: cashOrderEntity,
        });
        this.setState({ cashOrderModalMounted: true });
    };

    _onOpenEditCashOrderModal = cashOrderEntity => {
        this.props.setModal(MODALS.CASH_ORDER, {
            editMode:        true,
            printMode:       false,
            cashOrderEntity: cashOrderEntity,
        });
        this.setState({ cashOrderModalMounted: true });
    };

    render() {
        const {
            collapsed,
            stats,
            modal,
            modalProps,
            setCashOrdersFilters,
            clearCashOrderForm,
            cashOrders,
            filters,
        } = this.props;

        return (
            <Layout
                title={ <FormattedMessage id='navigation.flow_of_money' /> }
                controls={
                    <div className={ Styles.buttonGroup }>
                        { /* <Icon type='printer' className={ Styles.printIcon } /> */ }
                        <StyledButton
                            type='secondary'
                            onClick={ () => this._onOpenCashOrderModal() }
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
                        filters={ filters }
                    />
                </section>
                <Paper className={ Styles.content }>
                    <CashOrdersTable
                        totalCount={ _.get(stats, 'totalCount') }
                        setCashOrdersFilters={ setCashOrdersFilters }
                        cashOrders={ cashOrders }
                        filters={ filters }
                        openPrint={ this._onOpenPrintCashOrderModal }
                        openEdit={ this._onOpenEditCashOrderModal }
                    />
                </Paper>
                { this.state.cashOrderModalMounted ? (
                    <CashOrderModal
                        resetModal={ this._onCloseCashOrderModal }
                        visible={ modal }
                        clearCashOrderForm={ clearCashOrderForm }
                        modalProps={ modalProps }
                    />
                ) : null }
            </Layout>
        );
    }
}
