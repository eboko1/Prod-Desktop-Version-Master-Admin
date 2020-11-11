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
                formLink:  book.addOrder,
                catalogueLink: book.ordersAppointments,
            },
            {
                itemName:         'approve',
                disabled:         true,
                formLink:  book.exception,
                catalogueLink: `${book.orders}/approve`,
            },
            {
                itemName:         'repair',
                disabled:         true,
                formLink:  book.exception,
                catalogueLink: `${book.orders}/progress`,
            },
            {
                itemName:         'done',
                disabled:         true,
                formLink:  book.exception,
                catalogueLink: `${book.orders}/success`,
            },
            {
                itemName:         'refuse',
                disabled:         true,
                formLink:  book.exception,
                catalogueLink: `${book.orders}/cancel`,
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'invitation',
                disabled:         true,
                formLink:  book.exception,
                catalogueLink: `${book.orders}/invitations`,
            },
            {
                itemName:         'feedback',
                disabled:         true,
                formLink:  book.feedback,
                catalogueLink: `${book.orders}/reviews`,
            }
        ],
    },
    {
        blockTitle: 'storage',
        items: [
            {
                itemName:         'order-to-supplier',
                formLink:  book.storageDocument,
                catalogueLink: book.storageOrders,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'ORDER',
                        documentType: 'SUPPLIER',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'ORDER',
                        documentType: 'SUPPLIER',
                    }
                },
            },
            {
                itemName:         'incoming-by-order',
                formLink:  book.storageDocument,
                catalogueLink: book.storageOrders,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'ORDER',
                        documentType: 'ORDERINCOME',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'ORDER',
                        documentType: 'ORDERINCOME',
                    }
                },
            },
            {
                itemName:         'order-correction',
                formLink:  book.storageDocument,
                catalogueLink: book.storageOrders,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'ORDER',
                        documentType: 'ADJUSTMENT',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'ORDER',
                        documentType: 'ADJUSTMENT',
                    }
                },
            },
            {
               emptyItem: true,
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'income',
                formLink:  book.storageDocument,
                catalogueLink: book.storageIncomes,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'INCOME',
                        documentType: 'SUPPLIER',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'INCOME',
                        documentType: 'SUPPLIER',
                    }
                },
            },
            {
                itemName:         'expense',
                formLink:  book.storageDocument,
                catalogueLink: book.storageExpenses,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'EXPENSE',
                        documentType: 'CLIENT',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'EXPENSE',
                        documentType: 'CLIENT',
                    }
                },
            },
            {
                itemName:         'transfer',
                formLink:  book.storageDocument,
                catalogueLink: book.storageTransfers,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'TRANSFER',
                        documentType: 'TRANSFER',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'TRANSFER',
                        documentType: 'TRANSFER',
                    }
                },
            },
            {
                itemName:         'write-off',
                formLink:  book.storageDocument,
                catalogueLink: book.storageExpenses,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'EXPENSE',
                        documentType: 'OWN_CONSUMPTION',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'EXPENSE',
                        documentType: 'OWN_CONSUMPTION',
                    }
                },
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'customer-return',
                formLink:  book.storageDocument,
                catalogueLink: book.storageIncomes,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'INCOME',
                        documentType: 'CLIENT',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'INCOME',
                        documentType: 'CLIENT',
                    }
                },
            },
            {
                itemName:         'return-to-supplier',
                formLink:  book.storageDocument,
                catalogueLink: book.storageExpenses,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'EXPENSE',
                        documentType: 'SUPPLIER',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'EXPENSE',
                        documentType: 'SUPPLIER',
                    }
                },
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'for-storage',
                formLink:  book.storageDocument,
                catalogueLink: book.storageIncomes,
                disabled: true,
            },
            {
                itemName:         'product-delivery',
                formLink:  book.storageDocument,
                catalogueLink: book.storageExpenses,
                disabled: true,
            },
            {
                itemName:         'tool-issuance',
                formLink:  book.storageDocument,
                catalogueLink: book.storageTransfers,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'TRANSFER',
                        documentType: 'TOOL',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'TRANSFER',
                        documentType: 'TOOL',
                    }
                },
            },
            {
                itemName:         'tool-return',
                formLink:  book.storageDocument,
                catalogueLink: book.storageTransfers,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'TRANSFER',
                        documentType: 'REPAIR_AREA',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'TRANSFER',
                        documentType: 'REPAIR_AREA',
                    }
                },
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'lack',
                formLink:  book.storageDocument,
                catalogueLink: book.storageExpenses,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'EXPENSE',
                        documentType: 'INVENTORY',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'EXPENSE',
                        documentType: 'INVENTORY',
                    }
                },
            },
            {
                itemName:         'excess',
                formLink:  book.storageDocument,
                catalogueLink: book.storageIncomes,
                formLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'INCOME',
                        documentType: 'INVENTORY',
                    }
                },
                catalogueLinkState : { 
                    showForm: true,
                    formData: {
                        type: 'INCOME',
                        documentType: 'INVENTORY',
                    }
                },
            },
        ],
    },
    {
        blockTitle: 'accounting',
        items: [
            {
                itemName:         'cash-order',
                formLink:  book.cashFlowPage,
                catalogueLink: book.cashFlowPage,
                formLinkState : { showForm: true },
            },
        ],
    },
    {
        blockTitle: 'catalogue',
        items: [
            {
                itemName:         'client',
                formLink:  book.clients,
                catalogueLink: book.clients,
                formLinkState : { showForm: true },
            },
            {
                itemName:         'supplier',
                formLink:  book.suppliersPage,
                catalogueLink: book.suppliersPage,
                formLinkState : { showForm: true },
            },
            {
                itemName:         'product',
                formLink:  book.products,
                catalogueLink: book.products,
                formLinkState : { showForm: true },
            },
            {
                itemName:         'labor',
                formLink:  book.laborsPage,
                catalogueLink: book.laborsPage,
                formLinkState : { showForm: true },
            },
            {
                itemName:         'diagnostics',
                formLink:  book.diagnosticPatterns,
                catalogueLink: book.diagnosticPatterns,
                formLinkState : { showForm: true },
            },
            {
                itemName:         'employee',
                formLink:  book.addEmployee,
                catalogueLink: book.employeesPage,
            },
            {
                itemName:         'warehouse',
                formLink:  book.warehouses,
                catalogueLink: book.warehouses,
                formLinkState : { showForm: true },
            },
            {
                itemName:         'cashbox',
                formLink:  book.cashSettingsPage,
                catalogueLink: book.cashSettingsPage,
            },
            {
                itemName:         'requisites',
                formLink:  book.requisites,
                catalogueLink: book.requisites,
                formLinkState : { showForm: true },
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'store-group',
                formLink:  book.productsGroups,
                catalogueLink: book.productsGroups,
                formLinkState : { showForm: true },
            },
            {
                itemName:         'markup-group',
                formLink:  book.priceGroups,
                catalogueLink: book.priceGroups,
            },
            {
                itemName:         'units',
                formLink:  book.products,
                catalogueLink: book.products,
                disabled: true,
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

    _renderItem = (blockTitle, {itemName, formLink, formLinkState, catalogueLink, catalogueLinkState, disabled, emptyItem}, key) => {
        return !emptyItem ? (
            <div key={ key } className={ disabled ? Styles.disabledItem + " " + Styles.item : Styles.item }>
                <Link
                    className={Styles.buttonLink}
                    to={ {
                        pathname: formLink,
                        state:    formLinkState,
                    } }
                >
                    <Button className={Styles.itemButton + " " + Styles[blockTitle]}>
                        <FormattedMessage id={`new-document-page.item.${itemName}`} />
                    </Button>
                </Link>
                <Link
                    className={Styles.folderLink}
                    to={ {
                        pathname: catalogueLink,
                        state:    catalogueLinkState,
                    } }
                >
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
