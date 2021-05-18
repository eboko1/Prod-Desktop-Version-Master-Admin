// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from "react-redux";
import { Table, notification } from 'antd';

// proj
import {
    sendEmailWithReceipt,
    sendSmsWithReceipt,
    downloadReceipt,
    registerCashOrderInCashdesk,
    registerServiceInputCashOrderInCashdesk,
    registerServiceOutputCashOrderInCashdesk,
} from "core/cash/duck";

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth
});

const mapDispatchToProps = {
    sendEmailWithReceipt,
    sendSmsWithReceipt,
    downloadReceipt,
    registerCashOrderInCashdesk,
    registerServiceInputCashOrderInCashdesk,
    registerServiceOutputCashOrderInCashdesk,
};

@connect( mapStateToProps, mapDispatchToProps )
export class CashOrdersTable extends Component {
    constructor(props) {
        super(props);
    }

    _setCashOrderEntity = cashOrderEntity => this.setState({ cashOrderEntity });

    /**
     * Called when user want to send receipt on client's email, email is taken from client for which cash order was created.
     * We can send emails for RST cashOrders only
     * @param {*} param.cashOrderId - cash order to generate email from(contains data about its RST cashbox and client)
     * @returns 
     */
    onSendEmail = ({cashOrderId}) => {
        const { sendEmailWithReceipt } = this.props;

        if(!cashOrderId) return;

        sendEmailWithReceipt({ cashOrderId});
    }

    /**
     *  When user want to send receipt on client's modile via sms, phone number is taken from client for which cash order was created.
     * We can send sms for RST cashOrders only.
     * @param {*} param.cashOrderId - cash order to generate email from(contains data about its RST cashbox and client)
     * @returns 
     */
    onSendSms = ({cashOrderId}) => {
        const { sendSmsWithReceipt } = this.props;

        if(!cashOrderId) return;

        sendSmsWithReceipt({ cashOrderId});
    }

    /**
     * This registers specific cash order in cashdesk base on its type and parameters(sale/return/service input/service output/)
     * @param {Object} params.cashOrder contains cashOrderId to register and necessary data about cashOrder
     */
    onRepeatRegistrationInCashdesk = ({cashOrder}) => {
        const {
            registerCashOrderInCashdesk,
            registerServiceInputCashOrderInCashdesk,
            registerServiceOutputCashOrderInCashdesk,
        } = this.props

        console.log("Cashorder: ", cashOrder);

        if(cashOrder.rst && cashOrder.clientId) { //Sale or return contains client and is applied to RST cashboxes
            // repeat registration
            registerCashOrderInCashdesk(cashOrder.id);
        } else if(cashOrder.otherCounterparty && cashOrder.type == "INCOME") {
            //repeat service input
            registerServiceInputCashOrderInCashdesk({cashOrderId: cashOrder.id});
        } else if(cashOrder.otherCounterparty && cashOrder.type == "EXPENSE") {
            //repeat service output
            registerServiceOutputCashOrderInCashdesk({cashOrderId: cashOrder.id});
        } else {
            //Error
            notification.error({
                message: "Error",
                description: `
                    Invalid type of cashOrder, it cannot be registred in
                    cashdesk because it was not detected as Service input,
                    Service output, Sale or Return
                `
            });
        }
    }

    render() {
        const {
            cashOrders,
            cashOrdersFetching,
            openPrint,
            openEdit,
            isMobile,
            downloadReceipt
        } = this.props;

        this.columns = columnsConfig({
            onRepeatRegistrationInCashdesk: this.onRepeatRegistrationInCashdesk,
            downloadReceipt:                downloadReceipt,
            openPrint:   openPrint,
            openEdit:    openEdit,
            isMobile:    isMobile,
            onSendEmail: this.onSendEmail,
            onSendSms:   this.onSendSms,
            user:        this.props.user,
        });

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(this.props.totalCount / 25) * 25,
            hideOnSinglePage: true,
            current:          this.props.filters.page,
            onChange:         page => {
                this.props.setCashOrdersPage({ page });
                this.props.fetchCashOrders();
            },
        };

        return (
            <Table
                size='small'
                className={ Styles.table }
                columns={ this.columns }
                pagination={ pagination }
                dataSource={ cashOrders }
                loading={ cashOrdersFetching }
                locale={ {
                    emptyText: <FormattedMessage id='no_data' />,
                } }
                rowClassName={(record) => {
                    //Change style if cash order was registred with rst(fiscal number) and its registration failed
                    return (record.rst && !record.isRegisteredWithRst)
                        ? Styles.unregisteredCashOrder
                        : void 0;
                }}
                scroll={ !isMobile && { x: 1000 } }
                rowKey={ record => record.id }
            />
        );
    }
}
