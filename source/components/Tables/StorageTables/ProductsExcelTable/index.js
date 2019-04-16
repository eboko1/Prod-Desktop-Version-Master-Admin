// vendor
import React from 'react';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';

// own
import { columnsConfig } from './config';

const ProductsExcelTableComponent = props => {
    const columns = columnsConfig(
        props.dataSource,
        props.getFieldDecorator,
        props.intl.formatMessage,
        props.storeGroups,
    );

    return (
        <Table
            size='small'
            columns={ columns }
            dataSource={ props.dataSource }
            pagination={ false }
            locale={ {
                emptyText: props.intl.formatMessage({ id: 'no_data' }),
            } }
            rowKey={ (record, index) =>
                `${index}-${record.code}-${record.productName}`
            }
        />
    );
};

export const ProductsExcelTable = injectIntl(ProductsExcelTableComponent);
