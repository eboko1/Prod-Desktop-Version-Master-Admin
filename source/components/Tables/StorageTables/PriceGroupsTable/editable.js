// vendor
import React, { useContext } from 'react';
import { Input, InputNumber, Form } from 'antd';

// won
import { EditableContext } from './context';
const FormItem = Form.Item;

export const EditableCell = props => {
    const { editing, dataIndex, inputType, record, ...restProps } = props;

    const form = useContext(EditableContext);

    const _getField = () => {
        if (inputType === 'number') {
            return <InputNumber />;
        }

        return <Input />;
    };

    return (
        <td { ...restProps }>
            { editing ? (
                <FormItem style={ { margin: 0 } }>
                    { form.getFieldDecorator(dataIndex, {
                        rules: [
                            {
                                required: true,
                                message:  'required',
                            },
                        ],
                        initialValue: record[ dataIndex ],
                    })(_getField()) }
                </FormItem>
            ) : 
                props.children
            }
        </td>
    );
};
