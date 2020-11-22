// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DatePicker } from 'antd';
import moment from 'moment';

// proj
import {
    fetchClientMRDs,
    fetchCashOrderEntity,
    setFilterDate,
    setClientMRDsPage,
    setCashOrderModalMounted,
    setCashOrderEntityIsFetching,
    selectCashOrderEntityIsFetching,
} from 'core/clientMRDs/duck';
import { Loader } from "commons";
import ClientMRDsTable from '../Tables/ClientMRDsTable'
import { setModal, resetModal, MODALS } from "core/modals/duck";
import { clearCashOrderForm } from "core/forms/cashOrderForm/duck";
import { CashOrderModal } from "modals";
import {fetchAPI} from 'utils';

// own
import Styles from './styles.m.css';

const DEF_DATE_FORMAT = 'DD/MM/YYYY';

const mapStateToProps = state => ({
    isFetching: state.ui.clientMRDsFetching,
    modal: state.modals.modal,
    modalProps: state.modals.modalProps,
    MRDsUntilDate: state.clientMRDs.filter.MRDsUntilDate,
    cashOrderEntity: state.clientMRDs.cashOrderEntity,
    clientMRDsPage: state.clientMRDs.filter.page,
    mrds: state.clientMRDs.mrds,
    stats: state.clientMRDs.stats,
    cashOrderModalMounted: state.clientMRDs.cashOrderModalMounted,
    cashOrderEntityIsFetching: state.clientMRDs.cashOrderEntityIsFetching,
});

const mapDispatchToProps = {
    setModal,
    resetModal,
    fetchClientMRDs,
    fetchAPI,
    setClientMRDsPage,
    setFilterDate,
    setCashOrderModalMounted,
    setCashOrderEntityIsFetching,
    fetchCashOrderEntity,
    clearCashOrderForm,
    selectCashOrderEntityIsFetching,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientMRDsTab extends Component {
    constructor(props) {
        super(props);
        
        this.onDatePicker.bind(this);
    }

    componentDidMount() {
        const { clientId } = this.props;
        
        this.props.setFilterDate(moment().format(DEF_DATE_FORMAT));
        this.props.fetchClientMRDs({ clientId });
        
    }

    //Event: date was changed in datapicker
    onDatePicker(date) {
        const { clientId } = this.props;

        this.props.setFilterDate(date.format(DEF_DATE_FORMAT));
        this.props.fetchClientMRDs({ clientId });
    }

    fetchCashOrderEntity_hardCode(cashOrderId) {
        const fetchedClientEntity = this.props.fetchAPI('GET', `/cash_orders/${cashOrderId}`);
    }

    //This opens modal with cash order
    _onOpenPrintCashOrderModal = cashOrderEntity => {
        this.props.setModal(MODALS.CASH_ORDER, {
            printMode: true,
            editMode: false,
            cashOrderEntity: cashOrderEntity,
        });
        // this.setState({ cashOrderModalMounted: true });
        this.props.setCashOrderModalMounted(true);
    };

    _onCloseCashOrderModal = () => {
        this.props.resetModal();
        this.props.clearCashOrderForm();
        // this.setState({ cashOrderModalMounted: false });
        this.props.setCashOrderModalMounted(false);
    };

    _loadPrintModal = async (orderId) => {
        // const {cashOrderEntity, cashOrderEntityIsFetching, fetchCashOrderEntity, setCashOrderEntityIsFetching, selectCashOrderEntityIsFetching} = this.props;
        // new Promise((resolve) => resolve(fetchCashOrderEntity(orderId)))
        //     .then(() => {
        //         this._onOpenPrintCashOrderModal(cashOrderEntity);
        //     });
        // fetchCashOrderEntity(orderId);
        // setCashOrderEntityIsFetching(true)

        const cashOrderEntity = await this.fetchCashOrderEntity_hardCode(orderId);
        this._onOpenPrintCashOrderModal(cashOrderEntity);
        // console.log(cashOrderEntity);
        // if(selectCashOrderEntityIsFetching()) {
        //     console.log("Yes, it is fetching!");
        //     <Loader />
        // } else {
        //     // this._onOpenPrintCashOrderModal(cashOrderEntity);
        // }
    }

    render() {
        const {
            fetchClientMRDs,
            fetchCashOrderEntity,
            setClientMRDsPage,
            isFetching,
            mrds,
            stats,
            clientMRDsPage,
            clientId,
            cashOrderEntity,
            cashOrderModalMounted,
            modal,
            modalProps,
        } = this.props;

        if (isFetching) {
            return <Loader loading={ isFetching } />;
        }

        return (
            <>
                <div className={Styles.headerContainer}>
                    <DatePicker
                        allowClear={false}
                        defaultValue={moment(this.props.MRDsUntilDate, DEF_DATE_FORMAT)}
                        format={DEF_DATE_FORMAT}
                        onChange={date => this.onDatePicker(date)}></DatePicker
                    >
                </div>

                <ClientMRDsTable
                    isFetching={isFetching}
                    mrds={mrds}
                    setMRDsPage={setClientMRDsPage}
                    fetchMRDs={fetchClientMRDs}
                    clientMRDsPage={clientMRDsPage}
                    clientId={clientId}
                    stats={stats}
                    fetchCashOrderEntity={fetchCashOrderEntity}
                    // openPrint={() => this._onOpenPrintCashOrderModal(cashOrderEntity)}
                    openPrint={this._loadPrintModal}
                />

                {cashOrderModalMounted ? (
                    <CashOrderModal
                        resetModal={this._onCloseCashOrderModal}
                        visible={modal}
                        clearCashOrderForm={clearCashOrderForm}
                        modalProps={modalProps}
                    />
                ) : null}
            </>
        );
    }
}
