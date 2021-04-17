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
} from 'core/clientMRDs/duck';
import { Loader } from "commons";
import { ClientMRDsTable } from 'components'
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
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientMRDsTab extends Component {
    constructor(props) {
        super(props);
        
        this.onDatePicker = this.onDatePicker.bind(this);
    }

    _showCashOrderModal = (order) => {
        const {clientId, client, setModal} = this.props;

        setModal(MODALS.CASH_ORDER, {
            cashOrderEntity: {
                clientId: clientId,
                clientName: client.name,
                clientSurname: client.surname,
                increase: order.dueAmountWithTaxes,
                orderId: order.orderId,
                orderNum: order.orderNum,
            },
            fromClient: true,
        })
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
    _onOpenPrintCashOrderModal = async (orderId) => {
        const cashOrderEntity = await fetchCashOrderEntity(orderId);
        await this._onOpenPrintCashOrderModal(cashOrderEntity);
        await this.props.setModal(MODALS.CASH_ORDER, {
            printMode: true,
            editMode: false,
            cashOrderEntity: cashOrderEntity,
        });
        this.props.setCashOrderModalMounted(true);
    };

    _onCloseCashOrderModal = () => {
        this.props.resetModal();
        this.props.clearCashOrderForm();
        this.props.setCashOrderModalMounted(false);
    };

    _loadPrintModal = async (orderId) => {
        await this._onOpenPrintCashOrderModal(orderId);
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
                    openPrint={this._loadPrintModal}
                    showCashOrderModal={this._showCashOrderModal}
                />

                <CashOrderModal
                    visible={modal}
                    modalProps={modalProps}
                />
            </>
        );
    }
}
