// vendor
import React, { forwardRef, memo } from 'react';
import { AutoComplete, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';

// own
const Option = AutoComplete.Option;
const FormItem = Form.Item;

export const DecoratedAutoComplete = memo(
    forwardRef((props, ref) => {
        const {
            //FormItem
            formItem,
            label,
            colon,
            className,
            style,
            hasFeedback,
            formItemLayout,

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
            options = [],
            optionValue,
            optionLabel,
            optionDisabled,
            filterOption,
            optionFilterProp,
            labelInValue,
            optionLabelProp,
            getItemValue,

            cnStyles,
            dropdownMatchSelectWidth,
            dropdownStyle,
            dropdownClassName,

            initialValue,
            onFocus,
        } = props;

        const renderAutoComplete = (
            <AutoComplete
                getItemValue={ getItemValue }
                mode={ mode }
                disabled={ disabled }
                showSearch={ showSearch }
                allowClear={ allowClear }
                className={ cnStyles }
                ref={ ref }
                labelInValue={ labelInValue }
                optionLabelProp={ optionLabelProp }
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
                dropdownClassName={ dropdownClassName }
                onKeyDown={ e => {
                    if (e.key === 'Enter') {
                        onPressEnter();
                    }
                } }
                onFocus={ onFocus }
                optionFilterProp={
                    optionFilterProp ? optionFilterProp : 'children'
                }
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
            </AutoComplete>
        );

        let autoComplete = null;
        if (getFieldDecorator) {
            autoComplete = getFieldDecorator(field, {
                ...initialValue
                    ? { initialValue: initialValue }
                    : { initialValue: void 0 },
                rules,
            })(renderAutoComplete);
        } else {
            autoComplete = renderAutoComplete;
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
                { autoComplete }
            </FormItem>
        ) : 
            autoComplete
        ;
    }),
);
