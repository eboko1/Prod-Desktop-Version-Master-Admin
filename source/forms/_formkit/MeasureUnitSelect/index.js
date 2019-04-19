// vendor
import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';

// proj
import { DecoratedSelect } from 'forms/DecoratedFields';

// own
const Option = Select.Option;

const measureUnits = Object.freeze({
    PIECE: 'PIECE',
    LITER: 'LITER',
});

const measureUnitsHumanization = {
    PIECE: [ 'шт', 'шт.', 'штука' ],
    LITER: [
        'л',
        'л.',
        'литры',
        'литер',
        'літер', 
    ],
};

export default props => {
    const {
        field,
        label,
        formItem,
        formItemLayout,
        formatMessage,
        getFieldDecorator,
        getPopupContainer,
        initialValue,
        rules,
    } = props;

    const value = _.findKey(measureUnitsHumanization, units => {
        return units.includes(initialValue);
    });

    return (
        <DecoratedSelect
            formItem={ formItem }
            formItemLayout={ formItemLayout }
            label={ label }
            fields={ {} }
            field={ field }
            getFieldDecorator={ getFieldDecorator }
            getPopupContainer={ getPopupContainer }
            initialValue={ value || measureUnits.PIECE }
            rules={ rules }
        >
            <Option value={ measureUnits.PIECE } key={ 'piece' }>
                { formatMessage({ id: 'storage.measure.piece' }) }
            </Option>
            <Option value={ measureUnits.LITER } key={ 'liter' }>
                { formatMessage({ id: 'storage.measure.liter' }) }
            </Option>
        </DecoratedSelect>
    );
};
