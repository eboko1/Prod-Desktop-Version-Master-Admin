// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Table, Icon, Popconfirm, notification, Button } from "antd";
import { Link } from 'react-router-dom';
import _ from "lodash";

// proj
import { Layout } from "commons";
import { ImportExportTable } from "components";
import { SyncImportExportModal } from "modals";
// own

export default class SyncImportPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
        	modalVisible: false,
        	tableData: [],
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
    }

    render() {
    	const { modalVisible, tableData } = this.state;
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
	    		/>
	    	</Layout>
	    );
    }
}