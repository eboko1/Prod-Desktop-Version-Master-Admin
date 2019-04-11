// vendor
import React, { Component } from 'react';
import { Table } from 'antd';

// own
import { EditableCell, EditableRow } from './EditableCell';
import { columnsConfig } from './config.js';
import Styles from './styles.m.css';

export class EditableTable extends Component {
    state = {
        editing: false,
    };

    _handleSave = suggestion => this.props.updateService(suggestion);

    render() {
        const {
            loading,
            data,
            count,
            setFilters,
            filters: { page },
        } = this.props;

        const components = {
            body: {
                row:  EditableRow,
                cell: EditableCell,
            },
        };
        
        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(count / 25) * 25,
            hideOnSinglePage: true,
            current:          page,
            onChange:         page => setFilters({ page }),
        };

        const columns = columnsConfig(this.props, this.state).map(col => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: record => {
                    return {
                        record,
                        editable:   col.editable,
                        dataIndex:  col.dataIndex,
                        title:      col.title,
                        details:    col.details,
                        cellType:   col.cellType,
                        handleSave: this._handleSave,
                    };
                },
            };
        });

        return (
            <Table
                components={ components }
                size='small'
                pagination={ pagination }
                dataSource={ data }
                columns={ columns }
                loading={ loading }
                childrenColumnName='details'
                rowClassName={ () => Styles.editableRow }
                // defaultExpandAllRows
                // expandedRowKeys={ 'suggestionId' }
                // rowKey={ (record, index) => `${record.serviceId}-${index}` }
                // rowKey={ 'serviceId' }
                // expandedRowKeys={ 'suggestionId' }
            />
        );
    }
}
