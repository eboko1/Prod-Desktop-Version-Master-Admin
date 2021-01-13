// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Table, Icon, Popconfirm, notification, Button, Modal, Checkbox, Radio, Progress, Select, DatePicker, Upload, message } from "antd";
import { Link } from 'react-router-dom';
import _ from "lodash";
import moment from "moment";
// proj

// own

@injectIntl
export default class SyncConflictsModal extends Component {
	constructor(props) {
        super(props);
        this.state = {
            conflictsData: undefined,
            conflictsTableData: [],
            conflictModalData: undefined,
        };

        this.columns = [
            {
                dataIndex: "key",
                key: "key",
                render: (data, row)=>{
                    return data + 1;
                }
            },
            {
                title: <FormattedMessage id="export_import_pages.data_base" />,
                dataIndex: "dataBase",
                key: "dataBase",
                render: (data, row)=>{
                    return data ? (
                        <FormattedMessage id={`export_import_pages.${data.toLowerCase()}`} />
                    ) : null
                }
            },
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
            },
            {
                title:  <FormattedMessage id="order_form_table.detail_name" />,
                dataIndex: "name",
                key: "name",
            },
        ];
    }

    fetchConflicts() {
        const that = this;
    	const token = localStorage.getItem('_my.carbook.pro_token');
    	let url = __API_URL__ + `/sync/conflicts/${this.props.conflictsId}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data[0]);
            data[0] = {
                id: 32,
                syncId: 168,
                datetime: "2021-01-11T22:48:12.192Z",
                conflicts: {
                    LABORS: [
                        {
                            ONEC: {
                                Labor_Id: "72062030000",
                                LaborName: "Kurt screws up"
                            },
                            CARBOOK: {
                                id: 9904,
                                name: "Fucked upasdas shitahey",
                                laborId: "72062030000",
                                Labor_Id: "72062030000",
                                laborname: "Fucked upasdas shitahey",
                                businessId: 1174
                            }
                        }
                    ],
                }
            };

            const conflictsTableData = [];
            let index = -1;
            Object.entries(data[0].conflicts).map(([key, value])=>{
                value.map((elem, index)=>{
                    conflictsTableData.push({
                        conflictData: elem,
                        key: index++,
                        dataBase: key,
                        conflictsId: that.props.conflictsId,
                    })
                })        
            })
       		that.setState({
                conflictsData: data[0],
                conflictsTableData,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    handleCancel = () => {
    	const { hideModal } = this.props;
    	hideModal();
    }

    handleOk = async () => {
    	const token = localStorage.getItem('_my.carbook.pro_token');
    }

    componentDidUpdate(prevProps) {
    	if(!prevProps.visible && this.props.visible) {
    		this.fetchConflicts();
    	}
    }

    render() {
    	const { type, visible, intl: {formatMessage} } = this.props;
        const { conflictsData, conflictsTableData, conflictModalData } = this.state;
        console.log(conflictsTableData)
    	return (
    		<Modal
    			title={<FormattedMessage id='export_import_pages.conflicts'/>}
    			visible={visible}
    			onOk={this.handleOk}
    			onCancel={this.handleCancel}
    			okText={<FormattedMessage id='export_import_pages.import'/>}
    			style={{width: 'fit-content', minWidth: 640}}
    			destroyOnClose
    		>
                <Table
                    columns={this.columns}
                    dataSource={conflictsTableData}
                    rowSelection={{
                        onChange: (selectedRowKeys, selectedRows) => {
                            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                        },
                    }}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                this.setState({
                                    conflictModalData: record
                                })
                            }, // click row
                            onDoubleClick: event => {}, // double click row
                        };
                    }}
                />
                <ConflictModal 
                    visible={Boolean(conflictModalData)}
                    hideModal={()=>{
                        this.setState({
                            conflictModalData: undefined,
                        })
                    }}
                    updateConflictsList={()=>{
                        this.fetchConflicts();
                    }}
                    conflict={conflictModalData}
                />
    		</Modal>
	    );
    }
}

@injectIntl
class ConflictModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    resolveConflict() {
        const that = this;
        const token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/sync/conflicts/${this.props.conflictsId}`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json();
            that.props.updateConflictsList();
            that.props.hideModal();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    handleCancel = () => {
        const { hideModal } = this.props;
        hideModal();
    }

    handleOk = async () => {
        this.resolveConflict();
    }

    render() {
        const { conflict, visible, intl: {formatMessage} } = this.props;
        return (
            <Modal
                title={<FormattedMessage id='export_import_pages.conflicts'/>}
                visible={visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                okText={<FormattedMessage id='export_import_pages.import'/>}
                style={{width: 'fit-content', minWidth: 640}}
                destroyOnClose
            >
                {conflict &&
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div>
                            <FormattedMessage id={`export_import_pages.${conflict.dataBase.toLowerCase()}`} />
                        </div>
                        <div>
                            {conflict.id}
                        </div>
                        <div>
                            {conflict.name}
                        </div>
                    </div>
                }
                <div 
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <div style={{width: '49%'}}> 
                        <div>1C</div>
                        {conflict && 
                            Object.entries(conflict.conflictData.ONEC).map(([key, value], index)=>{
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div>
                                            {key}
                                        </div>
                                        <div>
                                            {value}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div style={{width: '49%'}}>
                        <div>CARBOOK</div>
                        {conflict && 
                            Object.entries(conflict.conflictData.CARBOOK).map(([key, value], index)=>{
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div>
                                            {key}
                                        </div>
                                        <div>
                                            {value}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Modal>
        );
    }
}