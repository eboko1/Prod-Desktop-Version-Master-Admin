// vendor
import React from 'react';
import _ from 'lodash';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

// proj
import { MODALS } from 'core/modals/duck';
import { ActionIcons } from 'commons/_uikit';
import { permissions, isForbidden } from 'utils';
import { Barcode } from 'components';
import book from 'routes/book';

export default props => {
    const editable = !isForbidden(
        props.user,
        permissions.ACCESS_STORE_PRODUCTS,
    );

    const code = {
        title: props.intl.formatMessage({
            id: 'storage.product_code',
        }),
        dataIndex: 'code',
        width:     'auto',
        render:    (key, { id, name, code }) => (
            <Link to={ `${book.product}/${id}` }>
               { code }
            </Link>
        ),
        // render:    (key, { id, name, code }) => (
        //     <div
        //         onClick={ () =>
        //             props.setModal(MODALS.STORE_PRODUCT, {
        //                 id,
        //                 name,
        //                 code,
        //                 editing: true,
        //             })
        //         }
        //     >
        //         { code }
        //     </div>
        // ),
    };

    const name = {
        title: props.intl.formatMessage({
            id: 'storage.name',
        }),
        dataIndex: 'name',
        width:     'auto',
    };

    const brandName = {
        title: props.intl.formatMessage({
            id: 'storage.brand',
        }),
        dataIndex: 'brand',
        width:     'auto',
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
        width:     'auto',
        render:    (key, data) => (
            <div>{ _.get(data, 'priceGroup.multiplier') }</div>
        ),
    };

    const editAction = {
        width:     'auto',
        dataIndex: 'edit',
        render:    (key, { id, name, code }) => {
            return (
                <Link to={ `${book.product}/${id}` }>
                    <Icon
                        type='edit'
                        style={{
                            color: 'var(--green)',
                            fontSize: 24,
                            verticalAlign: 'baseline',
                        }}
                    />
                </Link>
            );
        },
    };

    const deleteAction = {
        width:     'auto',
        dataIndex: 'delete',
        render:    (key, { id, name, code }) => {
            return (
                <ActionIcons
                    delete={ () => props.deleteProduct(id) }
                />
            );
        },
    };

    const barcode = {
        width:     'auto',
        dataIndex: 'barcode',
        render:    (data) => data && (
            <Barcode
                value={data}
                iconStyle={{
                    fontSize: 24
                }}
            />
        ),
    }

    if (editable) {
        return [
            code,
            name,
            brandName,
            markup,
            editAction,
            deleteAction,
            //barcode,
        ];
    }

    return [
        code,
        name,
        brandName,
        markup,
        //barcode,
    ];
};
