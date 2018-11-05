// vendor
import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';

// own
import Styles from '../styles.m.css';
const FormItem = Form.Item;

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

                            return editing ? (
                                <FormItem style={ { margin: 0 } }>
                                    { form.getFieldDecorator(dataIndex, {
                                        rules: [
                                            {
                                                required: true,
                                                message:  `${title} is required.`,
                                            },
                                        ],
                                        initialValue: record[ dataIndex ],
                                    })(
                                        <Input
                                            ref={node => (this.input = node)} // eslint-disable-line
                                            onPressEnter={ this._save }
                                        />,
                                    ) }
                                </FormItem>
                            ) : (
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
}
