// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from "react-redux";
import { Table } from 'antd';

// proj
import { sendMailWithReceipt } from "core/cash/duck";

// own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth
});

const mapDispatchToProps = {
    sendMailWithReceipt,
};

@connect( mapStateToProps, mapDispatchToProps )
export class CashOrdersTable extends Component {
    constructor(props) {
        super(props);
    }

    _setCashOrderEntity = cashOrderEntity => this.setState({ cashOrderEntity });

    onSendEmail = ({cashOrderId}) => {
        const { user, sendMailWithReceipt } = this.props;

        if(!user.email || !cashOrderId) return;

        sendMailWithReceipt({receivers: [user.email], cashOrderId});
    }

    render() {
        const { cashOrders, cashOrdersFetching, openPrint, openEdit, isMobile, onRegisterInCashdesk } = this.props;

        this.columns = columnsConfig({
            openPrint: openPrint,
            openEdit:  openEdit,
            onRegisterInCashdesk,
            isMobile:  isMobile,
            onSendEmail: this.onSendEmail
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
