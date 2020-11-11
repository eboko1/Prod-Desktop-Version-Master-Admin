// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Icon } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'commons';
import book from 'routes/book';
// own
import Styles from './styles.m.css';

const struct = [
    {
        blockTitle: 'repairs',
        items: [
            {
                itemName:         'order',
                disabled:         false,
                newDocumentLink:  book.addOrder,
                allDocumentsLink: book.dashboard,
            },
            {
                itemName:         'record',
                disabled:         true,
                newDocumentLink:  book.exception,
                allDocumentsLink: book.exception,
            },
            {
                itemName:         'repair',
                disabled:         true,
                newDocumentLink:  book.exception,
                allDocumentsLink: book.exception,
            },
            {
                itemName:         'done',
                disabled:         true,
                newDocumentLink:  book.exception,
                allDocumentsLink: book.exception,
            },
            {
                itemName:         'refuse',
                disabled:         true,
                newDocumentLink:  book.exception,
                allDocumentsLink: book.exception,
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'invitation',
                disabled:         true,
                newDocumentLink:  book.exception,
                allDocumentsLink: book.exception,
            },
            {
                itemName:         'feedback',
                disabled:         true,
                newDocumentLink:  book.feedback,
                allDocumentsLink: book.feedback,
            }
        ],
    },
    {
        blockTitle: 'storage',
        items: [
            {
                itemName:         'order-to-supplier',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageOrders,
            },
            {
                itemName:         'incoming-by-order',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageOrders,
            },
            {
                itemName:         'order-correction',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageOrders,
            },
            {
               emptyItem: true,
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'income',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageIncomes,
            },
            {
                itemName:         'expense',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageExpenses,
            },
            {
                itemName:         'transfer',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageTransfers,
            },
            {
                itemName:         'write-off',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageExpenses,
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'customer-return',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageIncomes,
            },
            {
                itemName:         'return-to-supplier',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageExpenses,
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'for-storage',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageIncomes,
            },
            {
                itemName:         'product-delivery',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageExpenses,
            },
            {
                itemName:         'tool-issuance',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageTransfers,
            },
            {
                itemName:         'tool-return',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageTransfers,
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'minus-invent',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageExpenses,
            },
            {
                itemName:         'pluss-invent',
                newDocumentLink:  book.storageDocument,
                allDocumentsLink: book.storageIncomes,
            },
        ],
    },
    {
        blockTitle: 'accounting',
        items: [
            {
                itemName:         'cash-order',
                newDocumentLink:  book.cashFlowPage,
                allDocumentsLink: book.cashFlowPage,
            },
        ],
    },
    {
        blockTitle: 'catalogue',
        items: [
            {
                itemName:         'client',
                newDocumentLink:  book.clients,
                allDocumentsLink: book.clients,
            },
            {
                itemName:         'supplier',
                newDocumentLink:  book.suppliersPage,
                allDocumentsLink: book.suppliersPage,
            },
            {
                itemName:         'product',
                newDocumentLink:  book.products,
                allDocumentsLink: book.products,
            },
            {
                itemName:         'labor',
                newDocumentLink:  book.laborsPage,
                allDocumentsLink: book.laborsPage,
            },
            {
                itemName:         'diagnostics',
                newDocumentLink:  book.diagnosticPatterns,
                allDocumentsLink: book.diagnosticPatterns,
            },
            {
                itemName:         'employee',
                newDocumentLink:  book.addEmployee,
                allDocumentsLink: book.employeesPage,
            },
            {
                itemName:         'warehouse',
                newDocumentLink:  book.warehouses,
                allDocumentsLink: book.warehouses,
            },
            {
                itemName:         'cashbox',
                newDocumentLink:  book.cashFlowPage,
                allDocumentsLink: book.cashFlowPage,
            },
            {
                itemName:         'requisites',
                newDocumentLink:  book.requisites,
                allDocumentsLink: book.requisites,
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'store-group',
                newDocumentLink:  book.productsGroups,
                allDocumentsLink: book.productsGroups,
            },
            {
                itemName:         'markup-group',
                newDocumentLink:  book.priceGroups,
                allDocumentsLink: book.priceGroups,
            },
            {
                itemName:         'units',
                newDocumentLink:  book.products,
                allDocumentsLink: book.products,
            },
        ],
    },
];

class NewDocumentPage extends Component {
    constructor(props) {
        super(props);
    }

    _renderBlock = ({blockTitle, items}, key) => {
        return(
            <div key={ key } className={ Styles.block }>
                <div className={ Styles.blockTitle }>
                    <FormattedMessage id={`new-document-page.block.${blockTitle}`} />
                </div>
                <div className={ Styles.blockItems}>
                    {items.map((item, key)=>(
                        this._renderItem(blockTitle, item, key)
                    ))}
                </div>
            </div>
        )
    };

    _renderItem = (blockTitle, {itemName, newDocumentLink, allDocumentsLink, disabled, emptyItem}, key) => {
        return !emptyItem ? (
            <div key={ key } className={ disabled ? Styles.disabledItem + " " + Styles.item : Styles.item }>
                <Link to={ newDocumentLink }>
                    <Button disabled={disabled} className={Styles.itemButton + " " + Styles[blockTitle]}>
                        <FormattedMessage id={`new-document-page.item.${itemName}`} />
                    </Button>
                </Link>
                <Link to={ allDocumentsLink }>
                    <Icon type="folder-open" />
                </Link>
            </div>
        ) : (
            <div key={ key } className={ Styles.emptyItem + " " + Styles.item } />
        )
    };


    render() {
        return (
            <Layout
                title={ <FormattedMessage id='navigation.new_document' /> }
                description={ <FormattedMessage id='new-document-page.description' /> }
            >
                {struct.map((block, key)=>(
                    this._renderBlock(block, key)
                ))}
            </Layout>
        );
    }
}

export default NewDocumentPage;
