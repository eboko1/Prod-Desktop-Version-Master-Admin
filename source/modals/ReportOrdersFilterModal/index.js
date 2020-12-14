// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Icon, Input, Button, Modal } from 'antd';

// proj
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { UniversalFiltersForm, ReportOrdersFilterForm } from 'forms';
import { StatsCountsPanel } from 'components';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    // count:          state.orders.count,
    // orders:         state.orders.data,
    // filter:         state.orders.filter,
    // modal:          state.modals.modal,
    // sort:           state.orders.sort,
    // ordersFetching: state.ui.ordersFetching,
    // user:           state.auth,
});

const mapDispatchToProps = {
    // fetchOrders,
    // setOrdersStatusFilter,
    // setOrdersPageFilter,
    // createInviteOrders,
    setModal,
    resetModal,
    // setOrdersPageSort,
    // clearUniversalFilters,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ReportOrdersFilterModal extends Component {
    

    render() {

        const {
            visible,
            filterControls,
            filter
        } = this.props;

        const {
            fetchReportOrders,
            onOpenFilterModal,
            onCloseFilterModal,
        } = filterControls;
        
        return (
            <Modal
                // className={ Styles.universalFiltersModal }
                width={ '80%' }
                // title={ <FormattedMessage id='universal_filters' /> }
                // cancelText={ <FormattedMessage id='universal_filters.cancel' /> }
                // okText={ <FormattedMessage id='universal_filters.submit' /> }
                // wrapClassName={ Styles.ufmoldal }
                visible={ visible === MODALS.REPORT_ORDERS_FILTER }
                onOk={ () => {
                    console.log("OK");
                } }
                onCancel={ onCloseFilterModal}
            >
                {/* <StatsCountsPanel stats={ stats } />
                <UniversalFiltersForm
                    form={ form }
                    vehicleMakes={ vehicleMakes }
                    vehicleModels={ vehicleModels }
                    managers={ managers }
                    employees={ employees }
                    creationReasons={ creationReasons }
                    orderComments={ orderComments }
                    services={ services }
                    // onSubmit={ () => handleUniversalFiltersModalSubmit() }
                /> */}
                <ReportOrdersFilterForm
                    filter={filter}
                />
            </Modal>
        );
    }
}
