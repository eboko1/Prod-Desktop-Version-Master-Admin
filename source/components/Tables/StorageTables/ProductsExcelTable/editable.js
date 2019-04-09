// vendor
import React from 'react';
import { Form } from 'antd';

// proj
import { DecoratedInput } from 'forms/DecoratedFields';

const FormItem = Form.Item;

export const EditableContext = React.createContext();

export const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={ form }>
        <tr { ...props } />
    </EditableContext.Provider>
);

export const EditableFormRow = Form.create()(EditableRow);

export class EditableCell extends React.Component {
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
        console.log('→ toggleEdit');
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    _save = e => {
        console.log('→ _save e', e);
        const { record, handleSave } = this.props;
        console.log('→ handleSave', handleSave);
        this.form.validateFields((error, values) => {
            if (error && error[ e.currentTarget.id ]) {
                return;
            }
            this._toggleEdit();
            handleSave({ ...record, ...values });
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
                            console.log('form', form.getFieldsValue());

                            return editing ? (
                                <DecoratedInput
                                    formItem
                                    field={ dataIndex }
                                    getFieldDecorator={ form.getFieldDecorator }
                                    rules={ [
                                        {
                                            required: true,
                                            message:  `${dataIndex} is required.`,
                                        },
                                    ] }
                                    initialValue={ record[ dataIndex ] }
                                    ref={node => (this.input = node)} // eslint-disable-line
                                    onPressEnter={ this._save }
                                    onBlur={ this._save }
                                />
                            ) : (
                                <div
                                    className='editable-cell-value-wrap'
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
