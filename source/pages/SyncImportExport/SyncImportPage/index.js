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
        }
    }

    render() {
    	const { modalVisible } = this.state;
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
	    		/>
	    		<SyncImportExportModal
	    			visible={modalVisible}
	    			type={'IMPORT'}
	    			hideModal={()=>{
	    				this.setState({
	    					modalVisible: false,
	    				})
	    			}}
	    		/>
	    	</Layout>
	    );
    }
}