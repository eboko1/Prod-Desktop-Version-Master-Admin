// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import {v4} from 'uuid';
import { Button, Input, Popover } from 'antd';
import { images } from 'utils';

//Proj
import { FormattedDatetime } from 'components';
import { Numeral } from 'commons';

//Own
import Styles from './styles.m.css';

const DEFAULT_DATETIME = 'DD.MM.YYYY HH:mm';

//Choose width for each col
//It must be 100% of width in total!
const defWidth = {
    order:               'auto',
    datetime:            '10%',
    name:                '10%',
    brandName:             '10%',
    code:                    '10%',
    supplierName:       '10%',
    purchasePrice:         '10%',
    price:         '10%',
    count:         '5%',
    sum:         '10%',
    actions:     '5%',
    
}

export function columnsConfig(props) {

    const {
        onAddDetailToOrder,
        onCodeSearch,
        onBrandSearch,
        onNameSearch,
        onSupplierSearch,
    } = props;

    const orderCol = {
        title:     <FormattedMessage id='orders.order' />,
        width:     defWidth.order,
        dataIndex: 'orderNum',
        key:       'orderNum',
        render:    (orderNum) => (
            <div>
                {orderNum}
            </div>
        ),
    };

    const datetimeCol = {
        title:     <FormattedMessage id='orders.creation_date' />,
        width:     defWidth.datetime,
        dataIndex: 'orderDatetime',
        key:       'orderDatetime',
        render:    (orderDatetime) => (
            <>
                <FormattedDatetime datetime={orderDatetime} format={DEFAULT_DATETIME}/>
            </>
        ),
    };


    const codeCol = {
        title:     () => {
            return (
                <div>
                    <FormattedMessage id='order_form_table.product_code' />
                    <Input
                        onChange={(e) => onCodeSearch(_.get(e, 'target.value'))}
                    />
                </div>
            )
        },
        width:     defWidth.code,
        dataIndex: 'code',
        key:       'code',
    };

   const brandNameCol = {
        title:     () => {
            return (
                <div>
                    <FormattedMessage id='order_form_table.brand' />
                    <Input
                        onChange={(e) => onBrandSearch(_.get(e, 'target.value'))}
                    />
                </div>
            )
        },
        width:     defWidth.brandName,
        dataIndex: 'supplierBrandName',
        key:       'supplierBrandName',
    };

    const nameCol = {
        title:     () => {
            return (
                <div>
                    <FormattedMessage id='storage.product_name' />
                    <Input
                        onChange={(e) => onNameSearch(_.get(e, 'target.value'))}
                    />
                </div>
            )
        },
        width:     defWidth.name,
        dataIndex: 'name',
        key:       'name',
    };

    const supplierNameCol = {
        title:     () => {
            return (
                <div>
                    <FormattedMessage id='storage.business_supplier' />
                    <Input
                        onChange={(e) => onSupplierSearch(_.get(e, 'target.value'))}
                    />
                </div>
            )
        },
        width:     defWidth.supplierName,
        dataIndex: 'supplierName',
        key:       'supplierName',
    };


    const purchasePriceCol = {
        title:     <FormattedMessage id='storage.purchase_price' />,
        width:     defWidth.purchasePrice,
        align:     'right',
        dataIndex: 'purchasePrice',
        key:       'purchasePrice',
        render: (purchasePrice) => {
            return (<Numeral mask={"0,00.00"}>{purchasePrice}</Numeral>);
        }
    };

    const priceCol = {
        title:     <FormattedMessage id='storage.selling_price' />,
        width:     defWidth.price,
        align:     'right',
        dataIndex: 'price',
        key:       'price',
        render: (price) => {
            return (<Numeral mask={"0,00.00"}>{price}</Numeral>);
        }
    };

    const countCol = {
        title:     <FormattedMessage id='order_form_table.count' />,
        width:     defWidth.count,
        align:     'right',
        dataIndex: 'count',
        key:       'count',
    };

    const sumCol = {
        title:     <FormattedMessage id='order_form_table.sum' />,
        width:     defWidth.sum,
        align:     'right',
        dataIndex: 'sum',
        key:       'sum',
        render: (sum) => {
            return (<Numeral mask={"0,00.00"}>{sum}</Numeral>);
        }
    };

    const actionsCol = {
        width:     defWidth.actions,
        key:       v4(),
        render:    (detail) => (
            <Popover content={<FormattedMessage id="vehicle_page.hint_add_detail_to_order"/>}>
                <Button  onClick={()=>onAddDetailToOrder({detail})}>
                    <div
                        style={ {
                            width:           18,
                            height:          18,
                            backgroundColor: 'var(--text3)',
                            mask:       `url(${images.pistonIcon}) no-repeat center / contain`,
                            WebkitMask: `url(${images.pistonIcon}) no-repeat center / contain`,
                            transform:  'scale(-1, 1)',
                        } }
                    />
                </Button>                   
            </Popover>
            
        )
    };

    return [,
        orderCol,
        datetimeCol,
        codeCol,
        brandNameCol,
        nameCol,
        supplierNameCol,
        purchasePriceCol,
        priceCol,
        countCol,
        sumCol,
        actionsCol
    ];
}