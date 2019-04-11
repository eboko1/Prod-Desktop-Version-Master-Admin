// vendor
import React, { forwardRef, memo } from 'react';
import { TreeSelect, Form } from 'antd';

// own
const FormItem = Form.Item;
// const TreeNode = TreeSelect.TreeNode;

const defaultTreeData = [
    {
        title:    'Node1',
        value:    '0-0',
        key:      '0-0',
        children: [
            {
                title: 'Child Node1',
                value: '0-0-1',
                key:   '0-0-1',
            },
            {
                title: 'Child Node2',
                value: '0-0-2',
                key:   '0-0-2',
            },
        ],
    },
    {
        title: 'Node2',
        value: '0-1',
        key:   '0-1',
    },
];

export const DecoratedInput = memo(
    forwardRef((props, ref) => {
        const {
            //FormItem
            formItem,
            label,
            colon,
            className,
            hasFeedback,
            formItemLayout,

            // cnStyles,
            dropdownStyle,
            getFieldDecorator,
            disabled,
            rules,
            placeholder,

            treeData,
            field,
            initialValue,
            style,
            onChange,
        } = props;

        const treeSelect = getFieldDecorator(field, {
            ...initialValue ? { initialValue } : { initialValue: void 0 },
            rules,
        })(
            <TreeSelect
                showSearch
                style={ style || { width: 300 } }
                dropdownStyle={
                    dropdownStyle || { maxHeight: 400, overflow: 'auto' }
                }
                treeData={ treeData || defaultTreeData }
                placeholder={ placeholder }
                treeDefaultExpandAll
                allowClear
                onChange={ onChange }
                disabled={ disabled }
                ref={ ref }
            />,
        );

        return formItem ? (
            <FormItem
                label={ label }
                hasFeedback={ hasFeedback }
                colon={ colon }
                className={ className }
                { ...formItemLayout }
            >
                { treeSelect }
            </FormItem>
        ) : 
            treeSelect
        ;
    }),
);
