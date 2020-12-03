// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Icon, Table, notification, Popconfirm } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { replace, push } from 'connected-react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
// proj
import { Catcher } from 'commons';
import book from 'routes/book';
import {
    getDiagnosticsReport,
    getDiagnosticsAct,
    createAgreement,
} from 'core/forms/orderDiagnosticForm/saga';
// own
import Styles from './styles.m.css';

const   HEADER_CLIENT_SEARCH = 'HEADER_CLIENT_SEARCH',
        HEADER_STATION = 'HEADER_STATION',
        HEADER_EMPLOYEE = 'HEADER_EMPLOYEE',
        HEADER_REQUISITES = 'HEADER_REQUISITES',
        HEADER_CHANGE_STATUS = 'HEADER_CHANGE_STATUS',
        DIAGNOSTICS_ADD = 'DIAGNOSTICS_ADD',
        DIAGNOSTICS_ELEMENTS = 'DIAGNOSTICS_ELEMENTS',
        DIAGNOSTICS_COMPLETE = 'DIAGNOSTICS_COMPLETE',
        DIAGNOSTICS_CALCULATION = 'DIAGNOSTICS_CALCULATION',
        LABORS = 'LABORS',
        DETAILS = 'DETAILS',
        LABORS_DISCOUNTS = 'LABORS_DISCOUNTS',
        DETAILS_DISCOUNTS = 'DETAILS_DISCOUNTS',
        HEADER_SEND_AGREEMENT = 'HEADER_SEND_AGREEMENT',
        PRINT_INVOICE = 'PRINT_INVOICE',
        HEADER_PAY = 'HEADER_PAY',
        STOCK_BUTTON_ORDERED = 'STOCK_BUTTON_ORDERED',
        STOCK_BUTTON_ACCEPTED = 'STOCK_BUTTON_ACCEPTED',
        STOCK_BUTTON_RESERVED = 'STOCK_BUTTON_RESERVED',
        PRINT_ACT_OF_ACCEPTANCE = 'PRINT_ACT_OF_ACCEPTANCE',
        STOCK_BUTTON_GIVEN = 'STOCK_BUTTON_GIVEN',
        CREATE_DOC_TOL = 'CREATE_DOC_TOL',
        PRINT_BUSINESS_ORDER = 'PRINT_BUSINESS_ORDER',
        WORKSHOP = 'WORKSHOP',
        WORKSHOP_BUTTON_FINISH = 'WORKSHOP_BUTTON_FINISH',
        STOCK_BUTTON_RETURNED = 'STOCK_BUTTON_RETURNED',
        CREATE_DOC_TOR = 'CREATE_DOC_TOR',
        ORDER_CHECK = 'ORDER_CHECK',
        PRINT_COMPLETED_WORK = 'PRINT_COMPLETED_WORK';

@withRouter
@injectIntl
export default class RepairMapTable extends Component {
    constructor(props) {
        super(props);

        this.repairMapAction = this.repairMapAction.bind(this);
    }

    repairMapAction(operation) {
        const { orderId, setActiveTab, history, setModal, modals, download } = this.props;
        console.log(operation, this);
        switch(operation) {
            case HEADER_CLIENT_SEARCH:
                document.getElementById('OrderFormHeader').scrollIntoView({behavior: "smooth", block: "end"});
                break;
            case HEADER_STATION:
                document.getElementById('OrderFormHeader').scrollIntoView({behavior: "smooth", block: "end"});
                break;
            case HEADER_EMPLOYEE:
                document.getElementById('OrderFormHeader').scrollIntoView({behavior: "smooth", block: "end"});
                break;
            case HEADER_REQUISITES:
                document.getElementById('OrderFormHeader').scrollIntoView({behavior: "smooth", block: "end"});
                break;
            case HEADER_CHANGE_STATUS:
                document.getElementById('OrderFormHeader').scrollIntoView({behavior: "smooth", block: "end"});
                break;
            case DIAGNOSTICS_ADD:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('diagnostic');
                break;
            case DIAGNOSTICS_COMPLETE:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('diagnostic');
                break;
            case LABORS:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('services');
                break;
            case DETAILS:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('details');
                break;
            case LABORS_DISCOUNTS:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('services');
                break;
            case DETAILS_DISCOUNTS:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('details');
                break;
            case HEADER_SEND_AGREEMENT:
                const confirmFunc = ()=>{
                    notification.success({
                        message: this.props.intl.formatMessage({
                            id: `message_sent`,
                        }),
                    });
                };
                const errorFunc = ()=>{
                    notification.error({
                        message: this.props.intl.formatMessage({
                            id: `order-page.no_positions`,
                        }),
                    });
                };
                createAgreement(this.props.orderId, this.props.user.language, confirmFunc, errorFunc)
                break;
            case PRINT_INVOICE:
                download({
                    link: `/orders/reports/invoiceReport/${orderId}`,
                    name: 'invoiceReport'
                });
                break;
            case HEADER_PAY:
                document.getElementById('OrderFormHeader').scrollIntoView({block: "end"});
                setModal(modals.TO_SUCCESS);
                break;
            case STOCK_BUTTON_ORDERED:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('stock');
                break;
            case STOCK_BUTTON_ACCEPTED:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('stock');
                break;
            case STOCK_BUTTON_RESERVED:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('stock');
                break;
            case PRINT_ACT_OF_ACCEPTANCE:
                download({
                    link: `/orders/reports/actOfAcceptanceReport/${orderId}`,
                    name: 'actOfAcceptanceReport'
                });
                break;
            case STOCK_BUTTON_GIVEN:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('stock');
                break;
            case CREATE_DOC_TOL:
                history.push({
                    pathname: book.storageDocument,
                    state: {
                        showForm: true,
                        formData: {
                            type: 'TRANSFER',
                            documentType: 'TOOL',
                        }
                    }
                });
                break;
            case PRINT_BUSINESS_ORDER:
                download({
                    link: `/orders/reports/businessOrderReport/${orderId}`,
                    name: 'businessOrderReport'
                });
                break;
            case WORKSHOP:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('workshop');
                break;
            case WORKSHOP_BUTTON_FINISH:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('workshop');
                break;
            case STOCK_BUTTON_RETURNED:
                document.getElementById('OrderTabs').scrollIntoView({behavior: "smooth"});
                setActiveTab('stock');
                break;
            case CREATE_DOC_TOR:
                history.push({
                    pathname: book.storageDocument,
                    state: {
                        showForm: true,
                        formData: {
                            type: 'TRANSFER',
                            documentType: 'REPAIR_AREA',
                        }
                    }
                });
                break;
            case ORDER_CHECK:
                break;
            case PRINT_COMPLETED_WORK:
                download({
                    link: `/orders/reports/completedWorkReport/${orderId}`,
                    name: 'completedWorkReport'
                });
                break;
        }
    }

    render() {
        const { repairMap } = this.props;

        return (
            <div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        margin: '0 0 8px 0',
                    }}
                >
                    <span style={{
                        fontSize: 18,
                        fontWeight: 500,
                    }}>
                        <FormattedMessage id="repair_map_table.repair_map"/>
                    </span>
                    <Button
                        type='primary'
                        onClick={()=>{
                            var that = this;
                            let token = localStorage.getItem('_my.carbook.pro_token');
                            let url = __API_URL__ + `/orders/${this.props.orderId}/repair_map?update=true`;
                            fetch(url, {
                                method:  'GET',
                                headers: {
                                    Authorization: token,
                                },
                            })
                            .then(function(response) {
                                if (response.status !== 200) {
                                    return Promise.reject(new Error(response.statusText));
                                }
                                return Promise.resolve(response);
                            })
                            .then(function(response) {
                                return response.json();
                            })
                            .then(function(data) {
                                window.location.reload();
                                console.log(data);
                            })
                            .catch(function(error) {
                                console.log('error', error);
                            });
                        }}
                    >
                        <FormattedMessage id="repair_map_table.update_map"/>
                    </Button>
                </div>
                {repairMap && repairMap.map((elem, key)=>{
                    console.log(elem);
                    if(elem.childs && elem.childs.length) {
                        return (
                            <div
                                key={key}
                                className={Styles.mapBlock}
                            >
                                <div className={Styles[elem.color] + " " + Styles.mapBlockTitle}>{elem.name}</div>
                                <div className={Styles.mapChildsBlock}>
                                    {elem.childs.map((child, key)=>{
                                        return (
                                            <div
                                                key={key}
                                                className={Styles[child.color] + " " + Styles.childBlock}
                                            >
                                                <span>{child.name}</span>
                                                <Button
                                                    type='primary'
                                                    disabled={!child.operation}
                                                    onClick={()=>{
                                                        this.repairMapAction(child.operation)
                                                    }}
                                                >
                                                    <FormattedMessage id="repair_map_table.goto"/>
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        )
    }
}