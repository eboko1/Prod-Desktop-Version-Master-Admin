// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Table, Button } from 'antd';
import { v4 } from 'uuid';

// own
import { columnsConfig } from './config';
import { EditableFormRow, EditableCell } from './editable.js';
// import Styles from './styles.m.css';

export class ProductsExcelTable extends Component {
    state = {
        dataSource: [],
    };

    static getDerivedStateFromProps(props, state) {
        if (props.dataSource !== state.dataSource) {
            return {
                dataSource: props.dataSource,
            };
        }

        return null;
    }

    _handleDelete = key => {
        const dataSource = [ ...this.state.dataSource ];
        this.setState({
            dataSource: dataSource.filter(item => item.key !== key),
        });
    };

    _handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key:          count,
            productId:    '',
            productGroup: 32,
            price:        1000,
        };
        this.setState({
            dataSource: [ ...dataSource, newData ],
            count:      count + 1,
        });
    };

    _handleSave = row => {
        const newData = [ ...this.state.dataSource ];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[ index ];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData });
    };

    render() {
        const components = {
            body: {
                row:  EditableFormRow,
                cell: EditableCell,
            },
        };
        console.log('→ this.state', this.state);

        const columns = columnsConfig(this.props, this.state).map(col => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: record => ({
                    record,
                    editable:     col.editable,
                    dataIndex:    col.dataIndex,
                    title:        col.title,
                    handleSave:   this._handleSave,
                    handleDelete: this._handleDelete,
                }),
            };
        });

        return (
            <div>
                <Button
                    onClick={ this._handleAdd }
                    type='primary'
                    style={ { marginBottom: 16 } }
                >
                    Add a row
                </Button>
                <Table
                    // className={ Styles.table }
                    size='small'
                    columns={ columns }
                    dataSource={ this.state.dataSource }
                    // loading={cashboxesFetching}
                    // pagination={ pagination }
                    components={ components }
                    rowKey={ () => v4() }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </div>
        );
    }
}
