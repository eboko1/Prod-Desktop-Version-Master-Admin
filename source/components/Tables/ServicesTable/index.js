// vendor
import React, { Component } from 'react';
import { Form, Table, Icon } from 'antd';
import moment from 'moment';

// proj
import { DecoratedInputNumber } from 'forms/DecoratedFields';

// own
import { columnsConfig } from './config.js';
import Styles from './styles.m.css';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={ form }>
        <tr { ...props } />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

export default class ServicesTable extends Component {
    state = {
        editing: false,
    };

    componentDidMount() {
        if (this.props.editable) {
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            document.removeEventListener(
                'click',
                this.handleClickOutside,
                true,
            );
        }
    }

    _toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    _handleClickOutside = e => {
        const { editing } = this.state;
        if (
            editing &&
            this.cell !== e.target &&
            !this.cell.contains(e.target)
        ) {
            this.save();
        }
    };

    _save = () => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    render() {
        const { data, count, setFilter } = this.props;
        console.log('→ TABLE this.props', this.props);

        const components = {
            body: {
                row:  EditableFormRow,
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

        const columns = columnsConfig(this.props, this.state);

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
                // expandedRowRender={ (record, index, indent, expanded) => {
                //     console.log('→ record', record);
                //     console.log('→ expanded', expanded);
                // } }
            />
        );
    }
}
