// vendor
import React, { forwardRef, memo } from 'react';
import { TreeSelect, Form } from 'antd';
import _ from 'lodash';

// own
const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;

export const DecoratedTreeSelect = memo(
    forwardRef((props, ref) => {
        const {
            //FormItem
            formItem,
            label,
            colon,
            className,
            hasFeedback,
            formItemLayout,
            allowClear,

            cnStyles,
            getPopupContainer,
            dropdownStyle,
            getFieldDecorator,
            disabled,
            rules,
            placeholder,

            treeData,
            treeDataNodes,
            treeDefaultExpandAll,
            field,
            initialValue,
            style,
            onChange,
        } = props;

        const treeSelectFilterTreeNode = (input, treeNode) => {
            const compare1 = treeNode.props.title.toLowerCase();
            const compare2 = input.toLowerCase();

            return compare1.indexOf(compare2) >= 0;
        };

        const loop = treeDataNodes =>
            treeDataNodes.map((node, index) => {
                if (!_.isEmpty(node.childGroups)) {
                    return (
                        <TreeNode
                            value={ node.id }
                            title={ node.name }
                            label={ node.name }
                            key={ `${index}-${node.id}-${node.name}` }
                        >
                            { loop(node.childGroups) }
                        </TreeNode>
                    );
                }

                return (
                    <TreeNode
                        isLeaf
                        value={ node.id }
                        title={ node.name }
                        label={ node.name }
                        key={ `${index}-${node.id}-${node.name}` }
                    >
                        { !_.isEmpty(node.childGroups) }
                    </TreeNode>
                );
            });

        const treeSelect = getFieldDecorator(field, {
            ...initialValue ? { initialValue } : { initialValue: void 0 },
            rules,
        })(
            <TreeSelect
                className={ cnStyles }
                showSearch
                style={ style }
                getPopupContainer={ getPopupContainer }
                dropdownStyle={
                    dropdownStyle || { maxHeight: 400, overflow: 'auto' }
                }
                treeData={ treeData }
                placeholder={ placeholder }
                treeDefaultExpandAll={ treeDefaultExpandAll }
                allowClear={ allowClear }
                onChange={ onChange }
                disabled={ disabled }
                ref={ ref }
                filterTreeNode={ treeSelectFilterTreeNode }
            >
                { !_.isEmpty(treeDataNodes) ? loop(treeDataNodes) : null }
            </TreeSelect>,
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
