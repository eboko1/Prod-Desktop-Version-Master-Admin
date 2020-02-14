import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { sendDiagnosticAnswer } from 'core/forms/orderDiagnosticForm/saga';
import Styles from './styles.m.css';

export const DiagnosticStatusButtons = props => {
    const { status, rowProp } = props;
    function handleClick(){

    }
    return status>0 ? (
            <div>
                <button onClick={()=>sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId,rowProp.diagnosticId,rowProp.processId,0)}>
                    <FormattedMessage id='order_form_table.diagnostic.status.edit' />
                </button>
            </div>
        ) : (
            <div>
                <button onClick={()=>sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId,rowProp.diagnosticId,rowProp.processId,1)}>
                    <FormattedMessage id='order_form_table.diagnostic.status.ok' />
                </button>
                <button onClick={()=>sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId,rowProp.diagnosticId,rowProp.processId,2)}>
                    <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                </button>
                <button onClick={()=>sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId,rowProp.diagnosticId,rowProp.processId,3)}>
                    <FormattedMessage id='order_form_table.diagnostic.status.critical' />
                </button>
            </div>
        );
}