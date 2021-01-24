// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Table, Icon, Popconfirm, notification, Button, Modal } from "antd";
import { Link } from 'react-router-dom';
import _ from "lodash";

// proj
import { Layout } from "commons";
import { ImportExportTable } from "components";
import { SyncImportExportModal, SyncConflictsModal } from "modals";
// own

export default class SyncImportPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
        	modalVisible: false,
        	tableData: [],
            conflictsId: undefined,
            errorsId: undefined,
            intervalId: undefined,
        }
    }

    fetchTable = () => {
    	const that = this;
    	const token = localStorage.getItem('_my.carbook.pro_token');
    	let url = __API_URL__ + `/sync/history?type=IMPORT`;
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
            return response.json()
        })
        .then(function (data) {
            console.log(data);
            that.setState({
            	tableData: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    componentDidMount() {
        this.fetchTable();
        var intervalId = setInterval(this.fetchTable, 5000);
       this.setState({intervalId: intervalId});
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    render() {
    	const { modalVisible, tableData, conflictsId, errorsId } = this.state;
    	return (
	    	<Layout
	    		title={ <FormattedMessage id='navigation.sync_import' /> }
	    		controls={
	    			<Button
		    			type='primary'
		    			onClick={()=>{
		    				this.setState({
		    					modalVisible: true,
		    				})
		    			}}
		    		>
		    			<FormattedMessage id='export_import_pages.import_data'/>
		    		</Button>
	    		}
	    	>
	    		<ImportExportTable
	    			type={'IMPORT'}
	    			tableData={tableData}
	    			fetchTable={this.fetchTable}
                    showConflictsModal={(id)=>{
                        this.setState({
                            conflictsId: id,
                        })
                    }}
                    showErrors={(id)=>{
                        this.setState({
                            errorsId: id,
                        })
                    }}
	    		/>
	    		<SyncImportExportModal
	    			visible={modalVisible}
	    			tableData={tableData}
	    			type={'IMPORT'}
	    			hideModal={()=>{
	    				this.setState({
	    					modalVisible: false,
	    				});
	    				this.fetchTable();
	    			}}
                    showConflictsModal={(id)=>{
                        this.setState({
                            conflictsId: id,
                        })
                    }}
	    		/>
                <SyncConflictsModal
                    visible={Boolean(conflictsId)}
                    conflictsId={conflictsId}
                    hideModal={()=>{
                        this.setState({
                            conflictsId: undefined,
                        })
                    }}
                />
                <ErrorsModal
                    visible={Boolean(errorsId)}
                    errorsId={errorsId}
                    hideModal={()=>{
                        this.setState({
                            errorsId: undefined,
                        })
                    }}
                />
	    	</Layout>
	    );
    }
}

@injectIntl
class ErrorsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: [],
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
                dataIndex: "table",
                key: "data_base",
                render: (data, row)=>{
                    return data ? (
                        <FormattedMessage id={`export_import_pages.${data.toLowerCase()}`} />
                    ) : null
                }
            },
            {
                title: <FormattedMessage id="export_import_pages.row" />,
                dataIndex: "row",
                key: "row",
            },
            {
                title:  <FormattedMessage id="export_import_pages.message" />,
                dataIndex: "message",
                key: "message",
            },
        ];
    }

    fetchErrors() {
        const that = this;
        const token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/sync/errors?syncId=${this.props.errorsId}`;
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
            data.map((elem, key)=>{
                elem.key = key;
            })
            console.log(data);
            that.setState({
                errors: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.visible && this.props.visible) {
            this.fetchErrors();
        }
    }

    render() {
        const { visible, intl: {formatMessage}, hideModal } = this.props;
        const { errors } = this.state;
        return (
            <Modal
                title={<FormattedMessage id='export_import_pages.errors'/>}
                visible={visible}
                onCancel={hideModal}
                style={{width: 'fit-content', minWidth: 840}}
                destroyOnClose
                maskClosable={false}
            >
                <Table
                    columns={this.columns}
                    dataSource={errors}
                />
            </Modal>
        );
    }
}