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
        // data:    void 0,
    };

    // static getDerivedStateFromProps(props, state) {
    //     if (props.data !== state.data) {
    //         return {
    //             data: props.data,
    //         };
    //     }
    //
    //     return null;
    // }
    //
    // _handleDelete = key => {
    //     this.setState({
    //         data: [ ...this.state.data ].filter(item => item.key !== key),
    //     });
    // };

    _handleSave = suggestion => this.props.updateService(suggestion);

    render() {
        // const { loading, count, setFilter } = this.props;
        // const { data } = this.state;
        const { loading, data, count, setFilter } = this.props;
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
                // console.log('→ col111', col);

                return col;
            }

            return {
                ...col,
                onCell: record => {
                    // console.log('→ col222', col);
                    // console.log('→ record!!!', record);

                    return {
                        record,
                        editable:   col.editable,
                        dataIndex:  col.dataIndex,
                        title:      col.title,
                        handleSave: this._handleSave,
                        details:    col.details,
                        cellType:   col.cellType,
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
                // defaultExpandAllRows
                childrenColumnName='details'
                rowClassName={ () => Styles.editableRow }
                // expandedRowKeys={ 'suggestionId' }
                // rowKey={ (record, index) => `${record.serviceId}-${index}` }
                // rowKey={ 'serviceId' }
                // expandedRowKeys={ 'suggestionId' }
                // expandedRowRender={ (record, index, indent, expanded) => {
                //     console.log('→ record', record);
                //     console.log('→ expanded', expanded);
                // } }
            />
        );
    }
}
