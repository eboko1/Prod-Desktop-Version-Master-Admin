// Core
import React from 'react';
import { Select } from 'antd';
// import { FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';

// own
const Option = Select.Option;

export const DecoratedSelect = props => {
    const {
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

        onSearch,
        onChange,
        // onSelect,
        options,
        optionValue,
        optionLabel,
        optionDisabled,
        filterOption,
        optionFilterProp,

        cnStyles,
        dropdownMatchSelectWidth,
        dropdownStyle,
    } = props;

    return getFieldDecorator(field, {
        rules,
    })(
        <Select
            mode={ mode }
            disabled={ disabled }
            showSearch={ showSearch }
            allowClear={ allowClear }
            className={ cnStyles }
            // onChange={ value => this.handleServiceSelect(record.key, value) }
            onChange={ onChange }
            onSearch={ onSearch }
            // onSelect={ onSelect }
            placeholder={ placeholder }
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
};
