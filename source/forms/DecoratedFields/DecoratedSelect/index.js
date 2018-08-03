// Core
import React from 'react';
import { Select, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';

// own
const Option = Select.Option;
const FormItem = Form.Item;

export const DecoratedSelect = props => {
    const {
        //FormItem
        formItem,
        label,
        colon,
        className,
        hasFeedback,
        formItemLayout,

        // DecoratedField
        children,
        getFieldDecorator,
        getPopupContainer,
        field,
        rules,
        mode,
        disabled,
        showSearch,
        allowClear,
        placeholder,
        notFoundContent,
        onSearch,
        onChange,
        onSelect,
        options,
        optionValue,
        optionLabel,
        optionDisabled,
        filterOption,
        optionFilterProp,
        labelInValue,
        optionLabelProp,

        cnStyles,
        dropdownMatchSelectWidth,
        dropdownStyle,
    } = props;

    const select = getFieldDecorator(field, {
        rules,
    })(
        <Select
            mode={ mode }
            disabled={ disabled }
            showSearch={ showSearch }
            allowClear={ allowClear }
            className={ cnStyles }
            labelInValue={ labelInValue }
            optionLabelProp={ optionLabelProp }
            // onChange={ value => this.handleServiceSelect(record.key, value) }
            onChange={ onChange }
            onSearch={ onSearch }
            onSelect={ onSelect }
            placeholder={ placeholder }
            notFoundContent={
                notFoundContent ? 
                    notFoundContent
                    : (
                        <FormattedMessage id='no_data' />
                    )
            }
            getPopupContainer={ getPopupContainer }
            dropdownMatchSelectWidth={ dropdownMatchSelectWidth }
            dropdownStyle={ dropdownStyle }
            optionFilterProp={ optionFilterProp ? optionFilterProp : 'children' }
            filterOption={
                filterOption
                    ? filterOption
                    : (input, option) =>
                        option.props.children
                            ? option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            : null
            }
        >
            { children
                ? children
                : options.map(option => (
                    <Option
                        value={ option[ optionValue ] }
                        key={ v4() }
                        disabled={ option[ optionDisabled ] }
                    >
                        { option[ optionLabel ] }
                    </Option>
                )) }
        </Select>,
    );

    return formItem ? (
        <FormItem
            label={ label }
            hasFeedback={ hasFeedback }
            colon={ colon }
            className={ className }
            formItemLayout={ formItemLayout }
        >
            { select }
        </FormItem>
    ) : 
        select
    ;
};
