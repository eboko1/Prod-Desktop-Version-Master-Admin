// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Table, Icon, Popconfirm, notification, Button, Modal, Checkbox, Radio, Progress, Select, DatePicker, Upload, message } from "antd";
import { Link } from 'react-router-dom';
import _ from "lodash";
import moment from "moment";
import { saveAs } from 'file-saver';
// proj
import { getData as getRequisites } from "core/requisiteSettings/saga";
// own
import Styles from './styles.m.css';
const Option = Select.Option;
const 	ALL = 'ALL',
		FROM_DOCS = 'FROM_DOCS',
		NONE = 'NONE',
		CARBOOK = 'CARBOOK',
		EXTERNAL = 'EXTERNAL',
		MANUAL = 'CUSTOM',
		SUBJECTS = 'SUBJECT',
		DONE = 'DONE',
		OTHER = 'OTHER',
		FROM_PREVIOUS = 'FROM_PREVIOUS',
		FROM_DATE = 'FROM_DATE',
		FILE = 'FILE',
		FTP = 'FTP',
		XML = 'xml',
		XLSX = 'xlsx',
		CSV = 'csv',
		CALL = 'CALL',
		REDUNDANT = 'redundant',
		APPROVED = 'approved',
		CANCELED = 'canceled',
		CREATED = 'created',
		IN_PROGRESS = 'in_progress',
		RESERVED = 'reserved',
		REQUIRED = 'required',
		SUCCESS = 'success',
		INVITE = 'invite';
const STATUSES = [CALL, REDUNDANT, APPROVED, CANCELED, CREATED, IN_PROGRESS, RESERVED, REQUIRED, SUCCESS, INVITE];

export default class SyncImportExportModal extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	requisites: [],
	        paramsModalVisible: false,
	        dataSource: [
	        	{
	        		name: 'clients',
	        		checked: true,
	        		sync: ALL,
	        		priority: CARBOOK,
	        		table: 'CLIENTS',
	        	},
	        	{
	        		name: 'clients_vehicles',
	        		checked: true,
	        		sync: ALL,
	        		priority: CARBOOK,
	        		table: 'CLIENTS_VEHICLES',
	        	},
	        	{
	        		name: 'bussiness_suppliers',
	        		checked: true,
	        		sync: ALL,
	        		priority: CARBOOK,
	        		table: 'BUSINESS_SUPPLIERS',
	        	},
	        	{
	        		name: 'employees',
	        		checked: true,
	        		sync: ALL,
	        		priority: CARBOOK,
	        		table: 'EMPLOYEES',
	        	},
	        	{
	        		name: 'store_products',
	        		checked: true,
	        		sync: ALL,
	        		priority: CARBOOK,
	        		table: 'STORE_PRODUCTS',
	        	},
	        	{
	        		name: 'store_groups',
	        		checked: true,
	        		sync: ALL,
	        		priority: CARBOOK,
	        		table: 'STORE_GROUPS',
	        	},
	        	{
	        		name: 'labors',
	        		checked: true,
	        		sync: ALL,
	        		priority: CARBOOK,
	        		table: 'LABORS',
	        	},
	        	{
	        		sync: NONE,
	        		priority: NONE,
	        		table: NONE,
	        	},
	        	{
	        		name: 'orders',
	        		checked: true,
	        		sync: NONE,
	        		priority: CARBOOK,
	        		table: 'ORDERS',
	        	},
	        	{
	        		name: 'store_docs',
	        		checked: true,
	        		sync: NONE,
	        		priority: CARBOOK,
	        		table: 'STORE_DOCS',
	        	},
	        	{
	        		name: 'cash_orders',
	        		checked: true,
	        		sync: NONE,
	        		priority: CARBOOK,
	        		table: 'CASH_ORDERS',
	        	},
	        ]
        };

        this.mainColumns = [
        	{
        		dataIndex: "checked",
                key: "checked",
                render: (data, row)=>{
                	return (
                		<Checkbox
                			checked={data}
                			style={!row.name ? {opacity: '0'} : {}}
                			onChange={({target})=>{
                				row.checked = target.checked;
                				this.setState({});
                			}}
                		/>
                	)
                }
            },
        	{
                title: <FormattedMessage id="export_import_pages.data_base" />,
                dataIndex: "name",
                key: "name",
                render: (data, row)=>{
                	return data ? (
                		<FormattedMessage id={`export_import_pages.${data}`} />
                	) : null
                }
            },
        ];

        this.syncColumn = [
        	{
        		title: <FormattedMessage id="export_import_pages.sync" />,
                key: "sync",
                children: [
                	{
                		title: <FormattedMessage id="export_import_pages.all" />,
		                dataIndex: "sync",
		                key: "ALL",
		                align: 'center',
		                render: (data, row)=>{
		                	return row.sync != NONE ? (
		                		<Radio
		                			value={ALL}
		                			checked={data == ALL}
		                			onChange={({target})=>{
		                				row.sync = target.value;
		                				this.setState({});
		                			}}
		                		/>
		                	) : null
		                }
                	},
                	{
                		title: <FormattedMessage id="export_import_pages.from_documents" />,
		                dataIndex: "sync",
		                key: "FROM_DOCS",
		                align: 'center',           
		                render: (data, row)=>{
		                	return row.sync != NONE ? (
		                		<Radio
		                			value={FROM_DOCS}
		                			checked={data == FROM_DOCS}
		                			onChange={({target})=>{
		                				row.sync = target.value;
		                				this.setState({});
		                			}}
		                		/>
		                	) : null
		                }
                	}
                ],
        	}
        ];

        this.priorityColumn = [
        	{
        		title: <FormattedMessage id="export_import_pages.priority" />,
                key: "priority",
                children: [
                	{
                		title: <FormattedMessage id="export_import_pages.carbook" />,
		                dataIndex: "priority",
		                key: "CARBOOK",
		                align: 'center',
		                render: (data, row)=>{
		                	return row.priority != NONE ? (
		                		<Radio
		                			value={CARBOOK}
		                			checked={data == CARBOOK}
		                			onChange={({target})=>{
		                				row.priority = target.value;
		                				this.setState({});
		                			}}
		                		/>
		                	) : null
		                }
                	},
                	{
                		title: <FormattedMessage id="export_import_pages.external" />,
		                dataIndex: "priority",
		                key: "EXTERNAL",
		                align: 'center',         
		                render: (data, row)=>{
		                	return row.priority != NONE ? (
		                		<Radio
		                			value={EXTERNAL}
		                			checked={data == EXTERNAL}
		                			onChange={({target})=>{
		                				row.priority = target.value;
		                				this.setState({});
		                			}}
		                		/>
		                	) : null
		                }
                	},
                	{
                		title: <FormattedMessage id="export_import_pages.manual" />,
		                dataIndex: "priority",
		                key: "MANUAL",
		                align: 'center',		                
		                render: (data, row)=>{
		                	return row.priority != NONE ? (
		                		<Radio
		                			value={MANUAL}
		                			checked={data == MANUAL}
		                			onChange={({target})=>{
		                				row.priority = target.value;
		                				this.setState({});
		                			}}
		                		/>
		                	) : null
		                }
                	}
                ],
        	}
        ];
    }

    handleCancel = () => {
    	const { hideModal } = this.props;
    	hideModal();
    }

    handleOk = () => {
    	this.setState({
    		paramsModalVisible: true,
    	})
    }

    componentDidMount() {
    	getRequisites((data)=>{
    		this.setState({
    			requisites: data,
    		})
    	})
    }

    render() {
    	const { type, visible, tableData, hideModal, showConflictsModal } = this.props;
    	const { paramsModalVisible, dataSource, requisites } = this.state;
    	return (
    		<Modal
    			title={<FormattedMessage id='export_import_pages.sync_data_base'/>}
    			visible={visible}
    			onOk={this.handleOk}
    			onCancel={this.handleCancel}
    			okText={<FormattedMessage id='export_import_pages.next'/>}
    			width={'fit-content'}
    			destroyOnClose
				maskClosable={false}
    		>
    			<Table
    				columns={type == 'IMPORT' ? [...this.mainColumns, ...this.priorityColumn] : [...this.mainColumns, ...this.syncColumn]}
		    		dataSource={dataSource}
		    		rowKey='table'
	                pagination={false}
    			/>
    			<SyncImportExportParametersModal
    				visible={paramsModalVisible}
	    			type={type}
	    			requisites={requisites}
	    			tablesOptions={dataSource}
	    			tableData={tableData}
	    			hideModal={()=>{
	    				this.setState({
	    					paramsModalVisible: false,
	    				})
	    			}}
	    			hideMainModal={()=>{
	    				hideModal();
	    				this.setState({
	    					paramsModalVisible: false,
	    				})
	    			}}
	    			showConflictsModal={showConflictsModal}
    			/>
    		</Modal>
	    );
    }
}


@injectIntl
class SyncImportExportParametersModal extends Component {
	constructor(props) {
        super(props);
        this.state = {
        	confirmLoading: false,
        	fileList: [],
        	ftpList: [],
        	fileType: XLSX,
        	syncDocs: ALL,
        	subjectRequisiteId: [],
        	status: DONE,
        	statuses: [],
        	syncPeriod: FROM_PREVIOUS,
        	fromDate: undefined,
        	syncThrough: FILE,
        };
    }

    handleCancel = () => {
    	const { hideModal } = this.props;
    	hideModal();
    }

    handleOk = async () => {
    	const token = localStorage.getItem('_my.carbook.pro_token');
    	const { hideModal, type, tablesOptions, tableData, hideMainModal, showConflictsModal } = this.props;
    	const { fileList, fileType, syncDocs, subjectRequisiteId, status, statuses, syncPeriod, fromDate, syncThrough } = this.state;

    	if(type == 'EXPORT') {
	    	const payload = {
	    		syncDocs: syncDocs,
	    		status: status,
	    		syncPeriod: syncPeriod,
	    		tablesOptions: tablesOptions.filter(({checked})=>checked).map(({checked, table, sync, priority})=>{
	    			if(checked) {
	    				return {
	    					table,
	    					sync: sync == NONE ? ALL : sync,
	    				}
	    			}
	    		}),
	    	}

	    	if(payload.syncDocs == SUBJECTS) {
	    		payload.subjectRequisiteId = subjectRequisiteId;
	    	}
	    	if(payload.status == DONE) {
	    		payload.status = OTHER;
	    		payload.statuses = [SUCCESS];
	    	}
	    	if(payload.syncPeriod == FROM_DATE) {
	    		payload.fromDate = fromDate.format('YYYY-MM-DD');
	    	}
	    	if(payload.syncPeriod == FROM_PREVIOUS) {
	    		if(tableData.length) {
	    			payload.syncPeriod = FROM_DATE;
		    		payload.fromDate = moment(tableData[0].datetime).format('YYYY-MM-DD');
	    		} else if(fromDate) {
		    		payload.fromDate = fromDate.format('YYYY-MM-DD');
		    	} else {
		    		payload.syncPeriod = ALL;
		    	}
	    	}

	    	console.log(payload);
    	
	        let url = __API_URL__ + `/sync/export/${fileType}`;
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
	            return response.blob();
	        })
	        .then(function (file) {
	            console.log(file)
           		saveAs(file, `backup-${moment().format('YYYY-MM-DD')}.${fileType}`);
           		hideMainModal();
	        })
	        .catch(function (error) {
	            console.log('error', error)
	        });
    	} else if(type == 'IMPORT') {
    		this.setState({
    			confirmLoading: true,
    		});
    		const normalizedTablesOptions = [...tablesOptions.filter(({checked})=>checked).map(({checked, table, sync, priority})=>{
	    			if(checked) {
	    				return {
	    					table,
	    					priority,
	    				}
	    			}
	    		})
    		];
	    	const formData = new FormData();
	    	formData.append('syncThrough', syncThrough);
	    	formData.append('file', fileList[0]);
	    	formData.append('tablesOptions', JSON.stringify(normalizedTablesOptions));
	        let url = __API_URL__ + `/sync/import/${fileType}`;
	        try {
			  	const response = await fetch(url, {
			    	method: 'POST',
			    	body: formData,
			    	headers: {
	                	'Authorization': token,
	            	},
			  	});
			  	const result = await response.json();
			  	console.log(result);
			  	this.setState({
	    			confirmLoading: true,
	    		});
	    		hideMainModal();
	    		//showConflictsModal(result.conflictsId);
			} catch (error) {
			  	console.error('error:', error);
			  	this.setState({
    				confirmLoading: true,
    			});
			}
    	}
    }

    render() {
    	const { type, visible, intl: {formatMessage}, requisites, tableData, hideMainModal } = this.props;
    	const { fileList, ftpList, confirmLoading } = this.state;
		const uploadFileProps = {
			onRemove: file => {
				this.setState(state => {
					const index = state.fileList.indexOf(file);
					const newFileList = state.fileList.slice();
					newFileList.splice(index, 1);
					return {
						fileList: newFileList,
					};
				});
			},
			beforeUpload: file => {
				this.setState(state => ({
					fileList: [...state.fileList, file],
				}));
				return false;
			},
			fileList,
		};
		const uploadFtpProps = {
			onRemove: ftp => {
				this.setState(state => {
					const index = state.ftpList.indexOf(ftp);
					const newFtpList = state.ftpList.slice();
					newFtpList.splice(index, 1);
					return {
						ftpList: newFtpList,
					};
				});
			},
			beforeUpload: ftp => {
				this.setState(state => ({
					ftpList: [...state.ftpList, ftp],
				}));
				return false;
			},
			ftpList,
		};
    	return (
    		<Modal
    			title={<FormattedMessage id='export_import_pages.sync_parameters'/>}
    			visible={visible}
    			onOk={this.handleOk}
    			onCancel={this.handleCancel}
    			okText={<FormattedMessage id='export_import_pages.sync'/>}
    			style={{width: 'fit-content', minWidth: 640}}
    			destroyOnClose
    			confirmLoading={confirmLoading}
				maskClosable={false}
    		>
    			{type == 'EXPORT' &&
	    			<div className={Styles.filtersBlock}>
						<FormattedMessage id='export_import_pages.sync_documents'/>
						<div className={Styles.filterElementWrap}>
							<FormattedMessage id='export_import_pages.entity'/>
		    				<Radio.Group defaultValue={ALL} className={Styles.radioGroup} onChange={({target})=>this.setState({syncDocs: target.value})}>
		    					<Radio value={ALL}><FormattedMessage id='export_import_pages.all'/></Radio>
		    					<Radio value={SUBJECTS} className={Styles.optionWithInput}>
			    					<FormattedMessage id='export_import_pages.subjects'/>
			    					<Select
			    						mode='multiple'
				    					className={Styles.radioInput}
				    					placeholder={formatMessage({id: 'export_import_pages.select_requisite'})}
				    					dropdownStyle={{zIndex: 9999}}
				    					onChange={(value)=>{
				    						this.setState({
				    							subjectRequisiteId: value,
				    						})
				    					}}
				    				>
				    					{requisites.map((elem, key)=>(
				    						<Option value={elem.id} key={key}>
			    								{elem.name}
			    							</Option>
				    					))}
				    				</Select>
			    				</Radio>
		    				</Radio.Group>
	    				</div>
	    				<div className={Styles.filterElementWrap}>
		    				<FormattedMessage id='export_import_pages.status'/>
		    				<Radio.Group defaultValue={DONE} className={Styles.radioGroup} onChange={({target})=>this.setState({status: target.value})}>
		    					<Radio value={ALL}><FormattedMessage id='export_import_pages.all'/></Radio>
		    					<Radio value={DONE}><FormattedMessage id='export_import_pages.done'/></Radio>
		    					<Radio value={OTHER} className={Styles.optionWithInput}>
		    						<FormattedMessage id='other'/>
		    						<Select
				    					mode='multiple'
				    					className={Styles.radioInput}
				    					placeholder={formatMessage({id: 'export_import_pages.select_statuses'})}
				    					dropdownStyle={{zIndex: 9999}}
				    					onChange={(value)=>{
				    						this.setState({
				    							statuses: value,
				    						})
				    					}}
				    				>
				    					{STATUSES.map((status, key)=>(
			    							<Option value={status} key={key}>
			    								<FormattedMessage id={`export_import_pages.status.${status.toUpperCase()}`}/>
			    							</Option>
			    						))}
				    				</Select>
		    					</Radio>
		    				</Radio.Group>
	    				</div>
	    			</div>
	    		}
    			{type == 'EXPORT' &&
	    			<div className={Styles.filtersBlock}>
	    				<div className={Styles.filterElementWrap}>
		    				<FormattedMessage id='export_import_pages.sync_period'/>
		    				<Radio.Group defaultValue={FROM_PREVIOUS} className={Styles.radioGroup} onChange={({target})=>this.setState({syncPeriod: target.value})}>
		    					<Radio value={FROM_PREVIOUS}><FormattedMessage id='export_import_pages.sync_from_previous'/></Radio>
		    					<Radio value={ALL}><FormattedMessage id='export_import_pages.all'/></Radio>
		    					<Radio value={FROM_DATE} className={Styles.optionWithInput}>
		    						<FormattedMessage id='export_import_pages.form_date'/>
		    						<DatePicker
		    							popupStyle={{zIndex: 9999}}
		    							onChange={(date)=>{
		    								this.setState({fromDate: date});
		    							}}
		    						/>
		    					</Radio>
		    				</Radio.Group>
		    			</div>
	    			</div>
	    		}
    			<div className={Styles.filtersBlock}>
    				{type == 'IMPORT' &&
    					<div className={Styles.filterElementWrap}>
		    				<FormattedMessage id='export_import_pages.sync_through'/>
		    				<Radio.Group defaultValue={FILE} className={Styles.radioGroup} onChange={({target})=>this.setState({syncThrough: target.value})}>
		    					<Radio value={FILE} className={Styles.optionWithInput}>
		    						<FormattedMessage id='export_import_pages.file'/>
		    						<Upload {...uploadFileProps}>
			    						<Button style={{width: 180}}>
			    							<Icon type='upload' /> <FormattedMessage id='export_import_pages.select_file' />
			    						</Button>
		    						</Upload>
		    					</Radio>
		    					<Radio value={FTP} className={Styles.optionWithInput} disabled>
		    						<FormattedMessage id='export_import_pages.ftp'/>
		    						<Upload {...uploadFtpProps}>
		    							<Button style={{width: 180}} disabled>
			    							<Icon type='upload' /> <FormattedMessage id='export_import_pages.select_file' />
			    						</Button>
		    						</Upload>
		    					</Radio>
		    				</Radio.Group>
		    			</div>
		    		}
	    			<div className={Styles.filterElementWrap}>
	    				<FormattedMessage id='export_import_pages.file_format'/>
	    				<Radio.Group defaultValue={XLSX} className={Styles.radioGroup} onChange={({target})=>this.setState({fileType: target.value})}>
	    					<Radio value={XML} disabled={type == 'IMPORT'}><FormattedMessage id='export_import_pages.xml'/></Radio>
	    					<Radio value={XLSX}><FormattedMessage id='export_import_pages.xlsx'/></Radio>
	    					<Radio value={CSV} disabled={type == 'IMPORT'}><FormattedMessage id='export_import_pages.csv'/></Radio>
	    				</Radio.Group>
	    			</div>
    			</div>
    		</Modal>
	    );
    }
}