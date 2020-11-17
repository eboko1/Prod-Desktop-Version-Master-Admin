//Vendor
import React, {Component} from 'react';
import { Table } from 'antd';
import { FormattedMessage } from "react-intl";

//proj
import { Loader } from "commons";

//own
import columnsConfig from './tableConfig';
import Style from './style.m.css';
import nestedCashOrdersTable from './NestedCashOrdersTable';


export default class ClientMRDsTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            isFetching,
            mrds,
            stats,
            setMRDsPage,
            fetchMRDs,
            clientMRDsPage,
            clientId,
            } = this.props

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            (stats && stats.countMRDs) ? stats.countMRDs : 25, 
            current:          clientMRDsPage,
            showQuickJumper: true,
            onChange:         page => {
                setMRDsPage(page);
                fetchMRDs({clientId});
            },
        };

        if (isFetching) {
            return <Loader loading={ isFetching } />;
        }

        return <div className={Style.tableContainer}>
            <Table
                size='small'
                columns={ columnsConfig() }
                dataSource={ mrds }
                pagination={pagination}
                loading={ isFetching }
                defaultExpandAllRows
                //Apply styles for each row
                rowClassName={(record) => {
                    if(record.isOverdue) return Style.overdueMRD;
                }}
                expandedRowRender={record => {return nestedCashOrdersTable(record.cashOrders)}}
                locale={ {
                    emptyText: (<FormattedMessage id="client-mrds-table.data_missing"/>),
                } }
                scroll={ { x: 1000 } }
                rowKey={ record => record.orderId }
                bordered={true}
            />
        </div>
    }
}