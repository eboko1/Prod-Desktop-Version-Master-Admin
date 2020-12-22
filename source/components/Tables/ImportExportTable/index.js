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

export default class ImportExportTable extends Component {
	constructor(props) {
        super(props);

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
                            onClick={() => {
                                const { fetchTable } = this.props;
                                const fetchData = {...payload};
                                delete fetchData.businessId;
                                delete fetchData.format;
                                delete fetchData.language;

                                const token = localStorage.getItem('_my.carbook.pro_token');
                                let url = __API_URL__ + `/sync/${row.type.toLowerCase()}/${payload.format.toLowerCase()}`;
                                fetch(url, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': token,
                                    },
                                    body: JSON.stringify(fetchData),
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
                                    saveAs(file, `backup-${moment(row.datetime).format('YYYY-MM-DD')}`);
                                    fetchTable();
                                })
                                .catch(function (error) {
                                    console.log('error', error)
                                });
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
        	width: "min-content",
            render: (payload, row) => {
            	return (
            		<Button
            			type='primary'
                        
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