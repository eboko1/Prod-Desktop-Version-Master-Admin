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
        formItem,
        formItemLayout,
        formatMessage,
        getFieldDecorator,
        getPopupContainer,
        initialValue,
    } = props;

    return (
        <DecoratedSelect
            formItem={ formItem }
            formItemLayout={ formItemLayout }
            label={ formatMessage({ id: 'storage.measure_units' }) }
            fields={ {} }
            field={ field }
            getFieldDecorator={ getFieldDecorator }
            getPopupContainer={ getPopupContainer }
            initialValue={ initialValue }
        >
            <Option value={ 'PIECE' } key={ 'piece' }>
                { formatMessage({ id: 'storage.measure.piece' }) }
            </Option>
            <Option value={ 'LITER' } key={ 'liter' }>
                { formatMessage({ id: 'storage.measure.liter' }) }
            </Option>
        </DecoratedSelect>
    );
};
