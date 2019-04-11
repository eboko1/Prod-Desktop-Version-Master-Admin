// vendor
import React, { useContext } from 'react';
import { Input, InputNumber, Form } from 'antd';

import { EditableContext } from './context';
const FormItem = Form.Item;

export const EditableCell = props => {
    // const form = useContext(EditableContext);

    const _getField = () => {
        if (props.inputType === 'number') {
            return <InputNumber />;
        }

        return <Input />;
    };
    // console.log('→ props', props);
    // <EditableContext.Consumer>
    //     { form => {
    // }}
    // </EditableContext.Consumer>
    console.log('=== EditableCell === props.editing', props.editing);

    return (
        <EditableContext.Consumer>
            { form => (
                <td { ...props }>
                    { props.editing ? (
                        <FormItem style={ { margin: 0 } }>
                            { form.getFieldDecorator(props.dataIndex, {
                                rules: [
                                    {
                                        required: true,
                                        message:  `Please Input ${props.title}!`,
                                    },
                                ],
                                initialValue: props.record[ props.dataIndex ],
                            })(_getField()) }
                        </FormItem>
                    ) : 
                        props.children
                    }
                </td>
            ) }
        </EditableContext.Consumer>
    );

    // return (
    //     <td { ...props }>
    //         { props.editing ? (
    //             <FormItem style={ { margin: 0 } }>
    //                 { form.getFieldDecorator(props.dataIndex, {
    //                     rules: [
    //                         {
    //                             required: true,
    //                             message:  `Please Input ${props.title}!`,
    //                         },
    //                     ],
    //                     initialValue: props.record[ props.dataIndex ],
    //                 })(_getField()) }
    //             </FormItem>
    //         ) :
    //             props.children
    //         }
    //     </td>
    // );
};
