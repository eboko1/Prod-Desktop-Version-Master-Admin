// vendor
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';

// proj
import {
    fetchPriceGroups,
    createPriceGroup,
    deletePriceGroup,
    selectPriceGroups,
} from 'core/storage/priceGroups';

// own
import { columnsConfig } from './config';
// import { EditableRow, EditableCell } from 'editable';

const PriceGroups = props => {
    useEffect(() => {
        props.fetchPriceGroups();
    }, []);

    const _handleDelete = number => props.deletePriceGroup(number);

    // const components = {
    //     body: {
    //         row:  EditableRow,
    //         cell: EditableCell,
    //     },
    // };

    return (
        <Table
            size='small'
            // components={ components }
            columns={ columnsConfig(props.intl.formatMessage, _handleDelete) }
            pagination={ false }
            dataSource={ props.priceGroups }
            loading={ props.priceGroupsFetching }
            locale={ {
                emptyText: props.intl.formatMessage({ id: 'no_data' }),
            } }
            rowKey={ record => record.id }
        />
    );
};

const mapStateToProps = state => ({
    priceGroups: selectPriceGroups(state),
});

const mapDispatchToProps = {
    fetchPriceGroups,
    createPriceGroup,
    deletePriceGroup,
};

export const PriceGroupsTable = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(PriceGroups),
);
