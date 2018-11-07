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
        style,
        hasFeedback,
        formItemLayout,
        innerRef,
        onPressEnter,

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

        initialValue,
        // globalLimit,
    } = props;

    const renderSelect = (
        <Select
            mode={ mode }
            disabled={ disabled }
            showSearch={ showSearch }
            allowClear={ allowClear }
            className={ cnStyles }
            ref={ innerRef }
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
            onInputKeyDown={ e => e.key === 'Enter' && onPressEnter() }
            optionFilterProp={ optionFilterProp ? optionFilterProp : 'children' }
            filterOption={
                filterOption
                    ? filterOption
                    : // : globalLimit
                //     ? (input, option) =>
                //         limitedSearch.handleLimitedSearch(
                //             input,
                //             option.props.children,
                //         )
                    (input, option) =>
                        option.props.children &&
                          option.props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
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
        </Select>
    );

    let select = null;

    if (getFieldDecorator) {
        select = getFieldDecorator(field, {
            ...initialValue ? { initialValue } : { initialValue: void 0 },
            rules,
        })(renderSelect);
    } else {
        select = renderSelect;
    }

    return formItem ? (
        <FormItem
            label={ label }
            hasFeedback={ hasFeedback }
            colon={ colon }
            className={ className }
            style={ style }
            { ...formItemLayout }
        >
            { select }
        </FormItem>
    ) : 
        select
    ;
};

// function LimitedSearch() {
//     let globalQuery = null;
//     let globalOptions = [];
//
//     this.handleLimitedSearch = function handleLimitedSearch(
//         query,
//         optionValue,
//     ) {
//         if (query !== globalQuery) {
//             globalOptions = _.map(children, 'props.children')
//                 .filter(value => value.toLowerCase().indexOf(query) !== -1)
//                 .slice(0, globalLimit);
//             globalQuery = query;
//         }
//
//         return globalOptions.includes(optionValue);
//     };
// }
//
// const limitedSearch = new LimitedSearch();
