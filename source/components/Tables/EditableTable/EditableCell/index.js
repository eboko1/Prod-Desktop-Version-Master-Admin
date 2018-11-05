// vendor
import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm, Form, Select } from 'antd';

// proj
import {
    DecoratedInput,
    DecoratedInputNumber,
    DecoratedSelect,
    LimitedDecoratedSelect,
} from 'forms/DecoratedFields';

// own
import { cellType } from './cellConfig';
import Styles from '../styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

export const EditableContext = React.createContext();

export const EditableRowCtx = ({ form, index, ...props }) => (
    <EditableContext.Provider value={ form }>
        <tr { ...props } />
    </EditableContext.Provider>
);

export const EditableRow = Form.create()(EditableRowCtx);

export class EditableCell extends Component {
    state = {
        editing: false,
    };

    componentDidMount() {
        if (this.props.editable) {
            document.addEventListener('click', this._handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            document.removeEventListener(
                'click',
                this._handleClickOutside,
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
            this._save();
        }
    };

    _save = () => {
        const { record, handleSave } = this.props;
        console.log('→ SAVErecord', record);
        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this._toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;

        return (
            // eslint-disable-next-line
            <td ref={node => (this.cell = node)} {...restProps}>
                { editable ? (
                    <EditableContext.Consumer>
                        { form => {
                            this.form = form;
                            // console.log('→ record', record);

                            return editing ? 
                                this._renderCell(form)
                                : (
                                // <FormItem style={ { margin: 0 } }>
                                //     { form.getFieldDecorator(dataIndex, {
                                //         rules: [
                                //             {
                                //                 required: true,
                                //                 message:  `${title} is required.`,
                                //             },
                                //         ],
                                //         initialValue: record[ dataIndex ],
                                //     })(
                                //         <Input
                                //             ref={node => (this.input = node)} // eslint-disable-line
                                //             onPressEnter={ this._save }
                                //         />,
                                //     ) }
                                // </FormItem>
                                    <div
                                        className={ Styles.editableCellValueWrap }
                                        style={ { paddingRight: 24 } }
                                        onClick={ this._toggleEdit }
                                    >
                                        { restProps.children }
                                    </div>
                                );
                        } }
                    </EditableContext.Consumer>
                ) : 
                    restProps.children
                }
            </td>
        );
    }

    _renderCell = form => {
        const { title, record, dataIndex, details } = this.props;
        const { getFieldDecorator } = form;
        console.log('→ CELL record', record);
        switch (this.props.cellType) {
            case cellType.NUMERAL:
                return (
                    <DecoratedInputNumber
                        formItem
                        field={ dataIndex }
                        getFieldDecorator={ getFieldDecorator }
                        rules={ [
                            {
                                required: true,
                                message:  `${title} is required.`,
                            },
                        ] }
                        initialValue={ record[ dataIndex ] }
                        innerRef={node => (this.input = node)} // eslint-disable-line
                        onPressEnter={ this._save }
                    />
                );
            case cellType.SELECT:
                return (
                    <DecoratedSelect
                        formItem
                        field={ dataIndex }
                        getFieldDecorator={ getFieldDecorator }
                        innerRef={node => (this.input = node)} // eslint-disable-line
                    />
                );
            case cellType.LIMITED_SELECT:
                return (
                    <LimitedDecoratedSelect
                        formItem
                        field={ dataIndex }
                        getFieldDecorator={ getFieldDecorator }
                        rules={ [
                            {
                                required: true,
                                message:  `${title} is required.`,
                            },
                        ] }
                        mode={ 'combobox' }
                        optionLabelProp={ 'children' }
                        showSearch
                        initialValue={ record.detailName || record[ dataIndex ] }
                        placeholder={ 'Выберете деталь' }
                        dropdownMatchSelectWidth={ false }
                        dropdownStyle={ { width: '50%' } }
                        cnStyles={ Styles.detailsSelect }
                        innerRef={node => (this.input = node)} // eslint-disable-line
                        getPopupContainer={node => (this.input = node)} // eslint-disable-line
                        allowClear
                        onSelect={ () => this._save() }
                    >
                        { details.map(({ detailId, detailName }) => (
                            <Option value={ String(detailId) } key={ detailId }>
                                { detailName }
                            </Option>
                        )) }
                    </LimitedDecoratedSelect>
                );
            default:
                return (
                    <DecoratedInput
                        formItem
                        field={ dataIndex }
                        getFieldDecorator={ getFieldDecorator }
                        rules={ [
                            {
                                required: true,
                                message:  `${title} is required.`,
                            },
                        ] }
                        initialValue={ record[ dataIndex ] }
                        innerRef={node => (this.input = node)} // eslint-disable-line
                        onPressEnter={ this._save }
                    />
                );
        }
    };
}
