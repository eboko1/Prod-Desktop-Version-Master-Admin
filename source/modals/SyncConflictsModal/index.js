// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Table, Icon, Popconfirm, notification, Button, Modal, Checkbox, Radio, Progress, Select, DatePicker, Upload, message, Collapse } from "antd";
import { Link } from 'react-router-dom';
import _ from "lodash";
import moment from "moment";
// proj

// own
const { Panel } = Collapse;
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
            /*data[0] = {
                id: 32,
                syncId: 168,
                datetime: "2021-01-11T22:48:12.192Z",
                conflicts: {
                    LABORS: [
                        {
                            EXTERNAL: {
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
                    ORDERS: [
                        {
                            EXTERNAL: {
                                WO_ID: 100251,
                                Amount: 6441,
                                Status: "approve",
                                Post_ID: 3,
                                details: [
                                    {
                                        name: "Мастила (оливи) для АКПП",
                                        count: "1.0000",
                                        price: "183.10",
                                        agreement: "REJECTED",
                                        supplierId: 231,
                                        storeGroupId: 3010202,
                                        purchasePrice: 130.8,
                                        supplierBrandId: 141,
                                        supplierPartNumber: null
                                    },
                                    {
                                        name: "Автозапчастини",
                                        count: "1.0000",
                                        price: "1111.00",
                                        agreement: "UNDEFINED",
                                        supplierId: 231,
                                        storeGroupId: 1000000,
                                        purchasePrice: 0,
                                        supplierBrandId: 523,
                                        supplierPartNumber: null
                                    },
                                    {
                                        name: "Автозапчастини",
                                        count: "1.0000",
                                        price: "1400.00",
                                        agreement: "UNDEFINED",
                                        supplierId: 0,
                                        storeGroupId: 1000000,
                                        purchasePrice: 1000,
                                        supplierBrandId: 113,
                                        supplierPartNumber: null
                                    }
                                ],
                                Duration: "05:30:00",
                                services: [
                                    {
                                        count: "1.0000",
                                        agreement: "UNDEFINED",
                                        serviceId: "13021150901",
                                        employeeId: 7229,
                                        serviceName: "Замір тиску паливного насоса",
                                        serviceHours: "0.0000",
                                        servicePrice: "300.00",
                                        purchasePrice: "0.00"
                                    },
                                    {
                                        count: "1.1000",
                                        agreement: "UNDEFINED",
                                        serviceId: "21011070302",
                                        employeeId: 7229,
                                        serviceName: "Replacement bearing",
                                        serviceHours: "1.1000",
                                        servicePrice: "300.00",
                                        purchasePrice: "5.00"
                                    },
                                    {
                                        count: "1.0000",
                                        agreement: "UNDEFINED",
                                        serviceId: "13021000000",
                                        employeeId: 7228,
                                        serviceName: "Замір тиску",
                                        serviceHours: "0.0000",
                                        servicePrice: "3300.00",
                                        purchasePrice: "0.00"
                                    }
                                ],
                                Client_ID: 62961,
                                WO_Number: "MRD-1174-100251",
                                Date_Closed: null,
                                Mechanic_ID: 7228,
                                Date_Created: "2021-01-04 07:53:22.725823",
                                Responsible_ID: 7751,
                                Date_Schedulled: "2020-07-09 09:00:00",
                                Purchase_man_ID: 7229,
                                Business_Credent_ID: null,
                                Customer_Credent_ID: null
                            },
                            CARBOOK: {
                                id: 100251,
                                WO_ID: 100251,
                                Amount: 6441,
                                Status: "approve",
                                Post_ID: 3,
                                details: [
                                    {
                                        name: "Мастила (оливи) для АКПП",
                                        count: "1.0000",
                                        price: "183.10",
                                        agreement: "REJECTED",
                                        supplierId: 231,
                                        storeGroupId: 3010202,
                                        purchasePrice: 130.8,
                                        supplierBrandId: 141,
                                        supplierPartNumber: null
                                    },
                                    {
                                        name: "Автозапчастини",
                                        count: "1.0000",
                                        price: "1111.00",
                                        agreement: "UNDEFINED",
                                        supplierId: 231,
                                        storeGroupId: 1000000,
                                        purchasePrice: 0,
                                        supplierBrandId: 523,
                                        supplierPartNumber: null
                                    },
                                    {
                                        name: "Автозапчастини",
                                        count: "1.0000",
                                        price: "1400.00",
                                        agreement: "UNDEFINED",
                                        supplierId: 0,
                                        storeGroupId: 1000000,
                                        purchasePrice: 1000,
                                        supplierBrandId: 113,
                                        supplierPartNumber: null
                                    }
                                ],
                                Duration: "03:30:00",
                                services: [
                                    {
                                        count: "1.0000",
                                        agreement: "UNDEFINED",
                                        serviceId: "13021150901",
                                        employeeId: 7229,
                                        serviceName: "Замір тиску паливного насоса",
                                        serviceHours: "0.0000",
                                        servicePrice: "300.00",
                                        purchasePrice: "0.00"
                                    },
                                    {
                                        count: "1.1000",
                                        agreement: "UNDEFINED",
                                        serviceId: "21011070302",
                                        employeeId: 7229,
                                        serviceName: "Replacement bearing",
                                        serviceHours: "1.1000",
                                        servicePrice: "300.00",
                                        purchasePrice: "5.00"
                                    },
                                    {
                                        count: "1.0000",
                                        agreement: "UNDEFINED",
                                        serviceId: "13021000000",
                                        employeeId: 7228,
                                        serviceName: "Замір тиску",
                                        serviceHours: "0.0000",
                                        servicePrice: "3300.00",
                                        purchasePrice: "0.00"
                                    }
                                ],
                                Client_ID: 62961,
                                WO_Number: "MRD-1174-100251",
                                externalId: 100251,
                                Date_Closed: null,
                                Mechanic_ID: 7228,
                                Date_Created: "2021-01-04T05:53:22.725Z",
                                Responsible_ID: 7751,
                                Date_Schedulled: "2020-07-09T06:00:00.000Z",
                                Purchase_man_ID: 7229,
                                Business_Credent_ID: null,
                                Customer_Credent_ID: null
                            }
                        }
                    ],
                }
            };*/

            const conflictsTableData = [];
            let key = 0;
            Object.entries(data[0].conflicts).map(([dataBase, value])=>{
                value.map((elem, index)=>{
                    conflictsTableData.push({
                        conflictData: elem,
                        key: key++,
                        dataBase: dataBase,
                        conflictsId: that.props.conflictsId,
                        index: index,
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

    resolveConflict(priority) {
        const { conflict: {conflictsId, dataBase, index} } = this.props;
        const payload = {
            conflictsId,
            conflictIndex: index,
            conflictTable: dataBase,
            priority,
        };
        const that = this;
        const token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/sync/conflicts/resolve`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify(payload),
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            //return response.json();
            that.props.updateConflictsList();
            that.props.hideModal();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    render() {
        const { conflict, visible, intl: {formatMessage}, hideModal } = this.props;
        return (
            <Modal
                title={<FormattedMessage id='export_import_pages.conflicts'/>}
                visible={visible}
                onCancel={hideModal}
                okText={<FormattedMessage id='export_import_pages.import'/>}
                style={{width: 'fit-content', minWidth: 840}}
                footer={[
                    <Button key={'CARBOOK'} onClick={()=>this.resolveConflict('CARBOOK')}>
                        <FormattedMessage id='cancel'/>
                    </Button>,
                    <Button key={'EXTERNAL'} type='primary' onClick={()=>this.resolveConflict('EXTERNAL')}>
                        <FormattedMessage id='export_import_pages.import'/>
                    </Button>
                ]}
                destroyOnClose
            >
                {conflict &&
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 16,
                            fontWeight: 500,
                            margin: '12px 0'
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
                    {(["CARBOOK", "EXTERNAL"]).map((type)=>(
                        <div style={{width: '49%'}} key={type}>
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 500,
                                    margin: '8px 0'
                                }}
                            >
                                <FormattedMessage id={`export_import_pages.${type.toLowerCase()}`}/>
                            </div>
                            {conflict && conflict.conflictData[type] &&
                                Object.entries(conflict.conflictData[type]).map(([key, value], index)=>{
                                    if(Array.isArray(value)) {
                                        return (
                                             <Collapse bordered={false} expandIconPosition='right' style={{borderRadius: 0, background: 'var(--lightGray)'}}>
                                                <Panel header={`${key}`} key="panel">
                                                    {value.map((arrayElement, arrayIndex)=>(
                                                        <div key={`${key}-${arrayIndex}`} style={{margin: '8px 0', borderBottom: '1px solid #d9d9d9', padding: '4px'}}>
                                                            {Object.entries(arrayElement).map(([key, value], index)=>{
                                                                return (
                                                                    <div
                                                                        key={`${arrayIndex}-${index}`}
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
                                                            })}
                                                        </div>
                                                    ))}
                                                </Panel>
                                            </Collapse>
                                        )
                                    } else {
                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    borderBottom: '1px solid #d9d9d9', 
                                                    padding: '12px 16px'
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
                                    }
                                })
                            }
                        </div>
                    ))}
                </div>
            </Modal>
        );
    }
}