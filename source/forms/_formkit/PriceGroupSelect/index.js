// vendor
import React from 'react';
import { Select } from 'antd';

// proj
import { DecoratedSelect } from 'forms/DecoratedFields';

// own
const Option = Select.Option;

export default props => {
    const {
        field,
        label,
        formItem,
        formItemLayout,
        formatMessage,
        getFieldDecorator,
        initialValue,
        priceGroups,
        cnStyles,
        rules,
        disabled,
    } = props;

    return (
        <DecoratedSelect
            formItem={ formItem }
            formItemLayout={ formItemLayout }
            label={ label }
            fields={ {} }
            field={ field }
            getFieldDecorator={ getFieldDecorator }
            getPopupContainer={ trigger => trigger.parentNode }
            initialValue={ initialValue }
            cnStyles={ cnStyles }
            disabled={ disabled }
            rules={ rules }
        >
            { priceGroups.map(({ number, multiplier }) => (
                <Option value={ number } key={ number }>
                    <span>
                        { formatMessage({ id: 'storage.price_group' }) } -{ ' ' }
                        { number }{ ' ' }
                    </span>
                    <span>
                        ({ formatMessage({ id: 'storage.markup' }) } -{ ' ' }
                        { multiplier })
                    </span>
                </Option>
            )) }
        </DecoratedSelect>
    );
};
