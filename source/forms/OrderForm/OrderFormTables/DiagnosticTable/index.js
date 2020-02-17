// vendor
import React, { Component } from 'react';
import { Table, Button, Checkbox } from 'antd';
import { FormattedMessage } from 'react-intl';

// proj
import { Catcher } from 'commons';
import { sendDiagnosticAnswer } from 'core/forms/orderDiagnosticForm/saga';
import { DiagnosticStatusButtons } from 'components';

// own
import Styles from './styles.m.css';

class DiagnosticTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            change: 1,
        }
        this.columns = [
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.plan' />,
                dataIndex: 'plan',
                key:       'plan',
                width:     '10%',
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.detail' />,
                dataIndex: 'detail',
                key:       'detail',
                width:     '15%',
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.stage' />,
                dataIndex: 'stage',
                key:       'stage',
                width:     '45%',
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.commentary' />,
                dataIndex: 'commentary',
                key:       'commentary',
                width:     '5%',
                render: (text, rowProp) => (
                    <Button>Comment</Button>
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.photo' />,
                dataIndex: 'photo',
                key:       'photo',
                width:     '5%',
                render: (text, rowProp) => (
                    <Button>Photo</Button>
                ),
            },
            {
                title:     <FormattedMessage id='order_form_table.diagnostic.status' />,
                dataIndex: 'status',
                key:       'status',
                width:     '15%',
                render: (text, rowProp) => (
                    <DiagnosticStatusButton
                        status={text}
                        rowProp={rowProp}
                    />
                ),
            },
            {
                dataIndex: 'delete',
                key:       'delete',
                width:     '5%',
                render: (text, rowProp) => (
                    <Button>Del</Button>
                ),
            },
        ];
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.orderDiagnostic !== this.props.orderDiagnostic;
    }

    render() {
        const {orderDiagnostic, orderId } = this.props;
        const dataSource = [];

        const diagnosticTemplatesCount = _.pick(orderDiagnostic, [
            "diagnosticTemplatesCount",
        ]).diagnosticTemplatesCount;
        const diagnosticTemplates = _.pick(orderDiagnostic, [
            "diagnosticTemplates",
        ]).diagnosticTemplates;
        for(let i = 0; i < diagnosticTemplatesCount; i++) {
            let diagnosticsCount = _.pick(diagnosticTemplates[i], [
                "diagnosticsCount",
            ]).diagnosticsCount;
            let diagnosticTemplateTitle = _.pick(diagnosticTemplates[i], [
                "diagnosticTemplateTitle",
            ]).diagnosticTemplateTitle;
            let diagnosticTemplateId = _.pick(diagnosticTemplates[i], [
                "diagnosticTemplateId",
            ]).diagnosticTemplateId;
            let diagnostics = _.pick(diagnosticTemplates[i], [
                "diagnostics",
            ]).diagnostics;
            for(let j = 0; j < diagnosticsCount; j++) {
                let diagnosticTitle = _.pick(diagnostics[j], [
                    "diagnosticTitle",
                ]).diagnosticTitle;
                let diagnosticId = _.pick(diagnostics[j], [
                    "diagnosticId",
                ]).diagnosticId;
                let processesCount = _.pick(diagnostics[j], [
                    "processesCount",
                ]).processesCount;
                let processes = _.pick(diagnostics[j], [
                    "processes",
                ]).processes;
                for(let k = 0; k < processesCount; k++) {
                    let processTitle = _.pick(processes[k], [
                        "processTitle",
                    ]).processTitle;
                    let processId = _.pick(processes[k], [
                        "processId",
                    ]).processId;
                    let answer = _.pick(processes[k], [
                        "answer",
                    ]).answer;
                    let comment = _.pick(processes[k], [
                        "comment",
                    ]).comment;
                    let photo = _.pick(processes[k], [
                        "photo",
                    ]).photo;
                    dataSource.push({
                        processId: processId,
                        plan: diagnosticTemplateTitle,
                        detail: diagnosticTitle,
                        stage: processTitle,
                        status: answer,
                        commentary: comment,
                        orderId: orderId,
                        diagnosticTemplateId: diagnosticTemplateId,
                        diagnosticId: diagnosticId,
                        photo: photo,
                    },);
                }
            }
        }
        console.log(orderDiagnostic, this.state);
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                name: record.stage,
            }),
        };
        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    className={ Styles.diagnosticTable }
                    dataSource={ dataSource }
                    columns={ columns }
                    rowSelection={rowSelection}
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }
}

class DiagnosticStatusButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            status: this.props.status
        }
    }
    handlClick = (status) => {
        const { rowProp } = this.props;
        sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId,rowProp.diagnosticId,rowProp.processId,status);
        this.setState({status:status});
        changeButtons();
    }
    changeButtons = () => {
        console.log(this.state.status);
        if(this.state.status){

        }
    }
    render(){
        console.log(this.state);
        const {  rowProp } = this.props;
        const status = this.state.status;
        return status>0 ? (
            <div>
                <Button onClick={()=>this.handlClick(0)}>
                    <FormattedMessage id='order_form_table.diagnostic.status.edit' />
                </Button>
            </div>
            ) : (
            <div>
                <Button onClick={()=>this.handlClick(1)}>
                    <FormattedMessage id='order_form_table.diagnostic.status.ok' />
                </Button>
                <Button onClick={()=>this.handlClick(2)}>
                    <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                </Button>
                <Button onClick={()=>this.handlClick(3)}>
                    <FormattedMessage id='order_form_table.diagnostic.status.critical' />
                </Button>
            </div>
        );
    }
}

export default DiagnosticTable;