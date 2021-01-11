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
        };
    }

    fetchConflicts() {
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
            console.log(data);
       		
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

    		</Modal>
	    );
    }
}