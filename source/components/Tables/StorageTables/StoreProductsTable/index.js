// vendor
import React from 'react';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';

// own
import columnsConfig from './config';

const ProductsTable = props => {
    return (
        <Table
            size='small'
            columns={ columnsConfig(props) }
            dataSource={ props.dataSource }
            pagination={ false }
            locale={ {
                emptyText: props.intl.formatMessage({ id: 'no_data' }),
            } }
        />
    );
};

export const StoreProductsTable = injectIntl(ProductsTable);
