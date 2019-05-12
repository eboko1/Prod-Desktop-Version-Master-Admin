// vendor
import React from 'react';
import _ from 'lodash';

// proj
import { MODALS } from 'core/modals/duck';
import { ActionIcons } from 'commons/_uikit';

export default props => {
    const code = {
        title: props.intl.formatMessage({
            id: 'storage.product_code',
        }),
        dataIndex: 'code',
        width:     '20%',
        render:    (key, { id, name, code }) => (
            <div
                onClick={ () =>
                    props.setModal(MODALS.STORE_PRODUCT, {
                        id,
                        name,
                        code,
                        editing: true,
                    })
                }
            >
                { code }
            </div>
        ),
    };

    const name = {
        title: props.intl.formatMessage({
            id: 'storage.name',
        }),
        dataIndex: 'name',
        width:     '20%',
    };

    const brandName = {
        title: props.intl.formatMessage({
            id: 'storage.brand',
        }),
        dataIndex: 'brand',
        width:     '20%',
        render:    (key, data) => {
            if (data.brandName) {
                return data.brandName;
            }

            return _.get(data, 'brand.name', '');
        },
    };

    const markup = {
        title: props.intl.formatMessage({
            id: 'storage.markup',
        }),
        dataIndex: 'priceGroup',
        width:     '20%',
        render:    (key, data) => (
            <div>{ _.get(data, 'priceGroup.multiplier') }</div>
        ),
    };

    const actions = {
        width:     'auto',
        dataIndex: 'delete',
        render:    (key, { id, name, code }) => {
            return (
                <ActionIcons
                    edit={ () =>
                        props.setModal(MODALS.STORE_PRODUCT, {
                            id,
                            name,
                            code,
                            editing: true,
                        })
                    }
                    delete={ () => props.deleteProduct(id) }
                />
            );
        },
    };

    return [
        code,
        name,
        brandName,
        markup,
        actions,
    ];
};
