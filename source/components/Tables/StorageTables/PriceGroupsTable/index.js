// vendor
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table, Form } from 'antd';

// proj
import {
    fetchPriceGroups,
    createPriceGroup,
    updatePriceGroup,
    deletePriceGroup,
    selectPriceGroups,
} from 'core/storage/priceGroups';

import { Loader } from 'commons';
import { permissions, isForbidden } from 'utils';

// own
import { columnsConfig } from './config';
import { EditableCell } from './editable';
import { EditableContext } from './context';

const PriceGroups = props => {
    useEffect(() => {
        props.fetchPriceGroups();
    }, []);

    const [ editingKey, setEditingKey ] = useState('');

    const _getEditingState = record => record.number === editingKey;

    const _startEditing = key => setEditingKey(key);

    const _cancelEditing = () => setEditingKey('');

    const _handleDelete = number => props.deletePriceGroup(number);

    const _save = (form, key) => {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const index = props.priceGroups.findIndex(
                item => key === item.number,
            );

            props.updatePriceGroup({ ...props.priceGroups[ index ], ...row });
            setEditingKey('');
        });
    };

    const components = {
        body: {
            cell: EditableCell,
        },
    };

    const isCRUDForbidden = isForbidden(props.user, permissions.ACCESS_CATALOGUE_PRICE_GROUPS_CRUD);

    const columns = columnsConfig(
        isCRUDForbidden,
        props.intl.formatMessage,
        editingKey,
        _getEditingState,
        _startEditing,
        _cancelEditing,
        _save,
        _handleDelete,
    ).map(col => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: record => ({
                record,
                inputType: col.dataIndex === 'multiplier' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title:     col.title,
                editing:   _getEditingState(record),
            }),
        };
    });

    return !props.priceGroups ? (
        <Loader loading={ props.priceGroups } />
    ) : (
        <EditableContext.Provider value={ props.form }>
            <Table
                size='small'
                bordered
                components={ components }
                columns={ columns }
                pagination={ false }
                dataSource={ props.priceGroups || [] }
                loading={ props.priceGroupsFetching }
                locale={ {
                    emptyText: props.intl.formatMessage({ id: 'no_data' }),
                } }
                rowKey={ record => record.number }
            />
        </EditableContext.Provider>
    );
};

const mapStateToProps = state => ({
    priceGroups: selectPriceGroups(state),
    user: state.auth,
});

const mapDispatchToProps = {
    fetchPriceGroups,
    createPriceGroup,
    updatePriceGroup,
    deletePriceGroup,
};

export const PriceGroupsTable = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(Form.create()(PriceGroups)),
);
