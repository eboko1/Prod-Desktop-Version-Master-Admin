// vendor
import React, { Component } from 'react';
import { Form, Table, Icon } from 'antd';
import moment from 'moment';
import { v4 } from 'uuid';

// proj
import { DecoratedInputNumber } from 'forms/DecoratedFields';

// own
import { EditableCell, EditableRow } from './EditableCell';
import { columnsConfig } from './config.js';
import Styles from './styles.m.css';

export default class EditableTable extends Component {
    state = {
        editing: false,
        data:    [],
    };

    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.data) {
            return {
                data: props.data,
            };
        }

        return null;
    }

    _handleDelete = key => {
        this.setState({
            data: [ ...this.state.data ].filter(item => item.key !== key),
        });
    };

    _handleSave = row => {
        const newData = [ ...this.state.data ];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[ index ];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ data: newData });
    };

    render() {
        const { data, count, setFilter } = this.props;
        // console.log('→ TABLE this.props', this.props);

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
            // current:          this.props.page,
            onChange:         page => setFilter({ page }),
        };

        const columns = columnsConfig(this.props, this.state).map(col => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: record => ({
                    record,
                    editable:   col.editable,
                    dataIndex:  col.dataIndex,
                    title:      col.title,
                    handleSave: this._handleSave,
                }),
            };
        });

        return (
            <Table
                components={ components }
                size='small'
                pagination={ pagination }
                dataSource={ data }
                columns={ columns }
                defaultExpandAllRows
                childrenColumnName='details'
                rowClassName={ () => Styles.editableRow }
                rowKey={ v4() }
                // expandedRowRender={ (record, index, indent, expanded) => {
                //     console.log('→ record', record);
                //     console.log('→ expanded', expanded);
                // } }
            />
        );
    }
}
