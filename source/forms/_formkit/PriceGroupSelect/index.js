// vendor
import React from 'react';
import { Select } from 'antd';

// proj
import { DecoratedSelect } from 'forms/DecoratedFields';

// own
const Option = Select.Option;

export default props => {
    const {
        formItem,
        formItemLayout,
        formatMessage,
        getFieldDecorator,
        initialValue,
        priceGroups,
    } = props;

    return (
        <DecoratedSelect
            formItem={ formItem }
            formItemLayout={ formItemLayout }
            label={ formatMessage({ id: 'storage.price_group' }) }
            fields={ {} }
            field='priceGroupNumber'
            getFieldDecorator={ getFieldDecorator }
            getPopupContainer={ trigger => trigger.parentNode }
            initialValue={ initialValue }
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
