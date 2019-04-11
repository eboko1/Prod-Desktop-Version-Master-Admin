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

// own
import { columnsConfig } from './config';
import { EditableCell } from './editable';
import { EditableContext } from './context';

const mockData = [
    {
        number:     1,
        businessId: 1174,
        multiplier: 1.2,
    },
    {
        number:     2,
        businessId: 1174,
        multiplier: 1.4,
    },
    {
        number:     3,
        businessId: 1174,
        multiplier: 1.6,
    },
    {
        number:     4,
        businessId: 1174,
        multiplier: 1.8,
    },
    {
        number:     5,
        businessId: 1174,
        multiplier: 2,
    },
];

const PriceGroups = props => {
    useEffect(() => {
        props.fetchPriceGroups();
    }, []);

    // const [ data, setData ] = useState(mockData);
    // const [ isEditing, setEditMode ] = useState(false);
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
    // const _save = (form, key) => {
    //     form.validateFields((error, row) => {
    //         if (error) {
    //             return;
    //         }
    //         const newData = [ ...data ];
    //         console.log('→ 11newData', newData);
    //         const index = newData.findIndex(item => key === item.number);
    //         if (index > -1) {
    //             console.log('→ 22save newData', newData);
    //             console.log('→ save index', index);
    //             const item = newData[ index ];
    //             const value = { ...item, ...row };
    //             newData.splice(index, 1, {
    //                 ...item,
    //                 ...row,
    //             });
    //             console.log('→ save item', item);
    //             console.log('→ row', row);
    //             console.log('→ value', value);
    //             console.log('→ 33 new Data', newData);
    //             // this.setState({ data: newData, editingKey: '' });
    //             setData(newData);
    //             setEditingKey('');
    //             props.updatePriceGroup(value);
    //         } else {
    //             console.log('→ else');
    //             newData.push(row);
    //             setData(newData);
    //             setEditingKey('');
    //         }
    //     });
    // };

    const components = {
        body: {
            cell: EditableCell,
        },
    };

    //   const columns = columnsConfig(props.intl.formatMessage, _handleDelete).map((col) => {
    const columns = columnsConfig(
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

    return (
        <EditableContext.Provider value={ props.form }>
            { console.log('=== TABLE === editingKey', editingKey) }
            <Table
                rowClassName='editable-row'
                // size='small'
                bordered
                components={ components }
                // columns={ columnsConfig(props.intl.formatMessage, _handleDelete) }
                columns={ columns }
                pagination={ false }
                // dataSource={ data }
                dataSource={ props.priceGroups }
                loading={ props.priceGroupsFetching }
                locale={ {
                    emptyText: props.intl.formatMessage({ id: 'no_data' }),
                } }
                rowKey={ record => record.id }
            />
        </EditableContext.Provider>
    );
};

const mapStateToProps = state => ({
    priceGroups: selectPriceGroups(state),
});

const mapDispatchToProps = {
    fetchPriceGroups,
    createPriceGroup,
    updatePriceGroup,
    deletePriceGroup,
};

export const PriceGroupsTable = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(Form.create()(PriceGroups)),
);
