// Core
import React from 'react';
import { Select } from 'antd';
// import { FormattedMessage } from 'react-intl';
import { v4 } from 'uuid';

// own
const Option = Select.Option;

export const DecoratedSelect = props => {
    const {
        getFieldDecorator,
        field,
        rules,
        mode,

        disabled,
        showSearch,
        allowClear,
        placeholder,

        onChange,
        // onSelect,
        options,
        optionValue,
        optionLabel,
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
            // onSelect={ onSelect }
            placeholder={ placeholder }
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
            { options.map(option => (
                <Option value={ option[ optionValue ] } key={ v4() }>
                    { option[ optionLabel ] }
                </Option>
            )) }
        </Select>,
    );
};
