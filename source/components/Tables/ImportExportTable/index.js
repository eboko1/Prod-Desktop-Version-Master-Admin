// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Table, Icon, Popconfirm, notification, Button } from "antd";
import { Link } from 'react-router-dom';
import _ from "lodash";
import moment from "moment";
import { saveAs } from 'file-saver';
// proj

// own

@injectIntl
export default class ImportExportTable extends Component {
	constructor(props) {
        super(props);
        this.state = {
            retryButtonLoadindId: undefined,
        }

        this.exportColumns = [
            {
                title: <FormattedMessage id="date" />,
                dataIndex: "datetime",
                key: "datetime",
                render: (data)=>{
                    return moment(data).format('DD.MM.YYYY HH:mm')
                }
            },
            {
                title: <FormattedMessage id="export_import_pages.number" />,
                dataIndex: "number",
                key: "number",
            },
            {
                title: <FormattedMessage id="export_import_pages.responsible" />,
                key: "responsible",
                render: (row)=>{
                    return (
                        (row.managerName || "") + " " + (row.managerSurname || "")
                    )
                }
            },
            {
                title: <FormattedMessage id="export_import_pages.records_count" />,
                key: "recordsCount",
                children: [
                	{
                		title: <FormattedMessage id="export_import_pages.directories_count" />,
		                dataIndex: "catalogueCount",
		                key: "catalogueCount",
                        align: 'right',
                	},
                	{
                		title: <FormattedMessage id="export_import_pages.documents_count" />,
		                dataIndex: "docCount",
		                key: "docCount",
                        align: 'right',
                	}
                ],
            },
            {
                title: <FormattedMessage id="export_import_pages.documents_datarenge" />,
                key: "documentsDatarenge",
                children: [
                	{
                		title: <FormattedMessage id="export_import_pages.daterange.from" />,
		                key: "fromDatetime",
                        dataIndex: "fromDate",
                        align: 'right',
                        render: (data, row)=>{
                            return moment(data).isValid() ? moment(data).format('DD.MM.YYYY') : <FormattedMessage id='long_dash'/>
                        }
                	},
                	{
                		title: <FormattedMessage id="export_import_pages.daterange.to" />,
		                dataIndex: "datetime",
		                key: "toDatetime",
                        align: 'right',
                        render: (data)=>{
                            return moment(data).format('DD.MM.YYYY')
                        }
                	}
                ],
            },
            {
                key: "retry",
                dataIndex: "payload",
                width: "min-content",
                render: (payload, row) => {
                	return (
                		<Button
                			type='primary'
                            style={{width: '100%'}}
                            loading={this.state.retryButtonLoadindId == row.id}
                            onClick={async () => {
                                const token = localStorage.getItem('_my.carbook.pro_token');
                                if(this.props.type == 'EXPORT') {
                                    let url = __API_URL__ + `/sync/${row.type.toLowerCase()}/${row.format.toLowerCase()}`;
                                    fetch(url, {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': token,
                                        },
                                        body: JSON.stringify({
                                            generate: false,
                                            repeatSyncById: row.id,
                                        }),
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
                                        saveAs(file, `backup-${moment(row.datetime).format('YYYY-MM-DD')}.${row.format.toLowerCase()}`);
                                        //fetchTable();
                                    })
                                    .catch(function (error) {
                                        console.log('error', error)
                                    });
                                } else if(this.props.type == 'IMPORT') {
                                    this.setState({
                                        retryButtonLoadindId: row.id,
                                    })
                                    const formData = new FormData();
                                    formData.append('repeatSyncById', row.id);
                                    formData.append('tablesOptions', JSON.stringify(row.payload.tablesOptions));
                                    let url = __API_URL__ + `/sync/${row.type.toLowerCase()}/${row.format.toLowerCase()}`;
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
                                            retryButtonLoadindId: undefined,
                                        });
                                        notification.success({
                                            message: this.props.intl.formatMessage({
                                                id: `export_import_pages.imported`,
                                            }),
                                        });
                                    } catch (error) {
                                        console.error('error:', error);
                                    }
                                }
                            }}
                		>
                			<FormattedMessage id='export_import_pages.retry'/>
                		</Button>
                	)
                }
            },
        ];

        this.importColumns = [...this.exportColumns, {
        	key: "conflicts",
            dataIndex: "conflictsId",
        	width: "min-content",
            render: (data, row) => {
            	return (
            		<Button
            			type='primary'
                        disabled={!Boolean(data)}
                        onClick={()=>{
                            this.props.showConflictsModal(data);
                        }}
            		>
            			<FormattedMessage id='export_import_pages.conflicts'/>
            		</Button>
            	)
            }
        }]
    }

    render() {
    	const { type, tableData, loading } = this.props;
    	return (
	    	<Table
	    		columns={type == 'IMPORT' ? this.importColumns : this.exportColumns}
	    		dataSource={tableData}
	    		rowKey='id'
                loading={loading}
                locale={{
                    emptyText: <FormattedMessage id="no_data" />,
                }}
	    	/>
	    );
    }
}