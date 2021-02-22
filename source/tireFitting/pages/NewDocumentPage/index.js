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
import { Layout } from 'tireFitting';
import book from 'routes/book';
import {permissions, isForbidden} from 'utils';
// own
import Styles from './styles.m.css';

const struct = [
    {
        blockTitle: 'repairs',
        permission: 'NEW_DOCUMENT_ORDERS',
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
        permission: 'NEW_DOCUMENT_STOCK',
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
        permission: 'NEW_DOCUMENT_ACCOUNTING',
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
        permission: 'NEW_DOCUMENT_CATALOGUES',
        items: [
            {
                itemName:         'client',
                formLink:  book.clients,
                catalogueLink: book.clients,
                formLinkState : { showForm: true },
                permission: 'GET_CLIENTS',
                permissionCRUD: 'CREATE_EDIT_DELETE_CLIENTS',
            },
            {
                itemName:         'supplier',
                formLink:  book.suppliersPage,
                catalogueLink: book.suppliersPage,
                formLinkState : { showForm: true },
                permission: 'ACCESS_SUPPLIERS',
                permissionCRUD: 'ACCESS_SUPPLIERS_CRUD',
            },
            {
                itemName:         'product',
                formLink:  book.products,
                catalogueLink: book.products,
                formLinkState : { showForm: true },
                permission: 'ACCESS_STORE_PRODUCTS',
                permissionCRUD: 'EDIT_STORE_PRODUCT_PRICE',
            },
            {
                itemName:         'labor',
                formLink:  book.laborsPage,
                catalogueLink: book.laborsPage,
                formLinkState : { showForm: true },
                permission: 'ACCESS_LABOR_CATALOGUE',
                permissionCRUD: 'ACCESS_CATALOGUE_LABORS_CRUD',
            },
            {
                itemName:         'diagnostics',
                formLink:  book.diagnosticPatterns,
                catalogueLink: book.diagnosticPatterns,
                formLinkState : { showForm: true },
                permission: 'ACCESS_DIAGNOSTIC_CATALOGUE',
                permissionCRUD: 'ACCESS_CATALOGUE_DIAGNOSTICS_CRUD',
            },
            {
                itemName:         'employee',
                formLink:  book.addEmployee,
                catalogueLink: book.employeesPage,
                permission: 'GET_EMPLOYEES',
                permissionCRUD: 'CREATE_EDIT_DELETE_EMPLOYEES',
            },
            {
                itemName:         'warehouse',
                formLink:  book.warehouses,
                catalogueLink: book.warehouses,
                formLinkState : { showForm: true },
                permission: 'ACCESS_CATALOGUE_STOCK',
                permissionCRUD: 'ACCESS_CATALOGUE_STOCK_CRUD',
            },
            {
                itemName:         'cashbox',
                formLink:  book.cashSettingsPage,
                catalogueLink: book.cashSettingsPage,
                permission: 'ACCESS_CATALOGUE_CASH',
                permissionCRUD: 'ACCESS_CATALOGUE_CASH_CRUD',
            },
            {
                itemName:         'requisites',
                formLink:  book.requisites,
                catalogueLink: book.requisites,
                formLinkState : { showForm: true },
                permission: 'ACCESS_CATALOGUE_REQUISITES',
                permissionCRUD: 'ACCESS_CATALOGUE_REQUISITES_CRUD',
            },
            {
                emptyItem: true,
            },
            {
                itemName:         'store-group',
                formLink:  book.productsGroups,
                catalogueLink: book.productsGroups,
                formLinkState : { showForm: true },
                permission: 'ACCESS_STORE_GROUPS',
                permissionCRUD: 'ACCESS_CATALOGUE_STORE_GROUPS_CRUD',
            },
            {
                itemName:         'markup-group',
                formLink:  book.priceGroups,
                catalogueLink: book.priceGroups,
                permission: 'ACCESS_CATALOGUE_PRICE_GROUPS',
                permissionCRUD: 'ACCESS_CATALOGUE_PRICE_GROUPS_CRUD',
            },
            {
                itemName:         'units',
                formLink:  book.products,
                catalogueLink: book.products,
                disabled: true,
                permission: 'ACCESS_STORE_PRODUCTS',
                permissionCRUD: 'EDIT_STORE_PRODUCT_PRICE',
            },
        ],
    },
];

const mapStateToProps = state => {
    return {
        user: state.auth,
    };
};

@connect(
    mapStateToProps,
    void 0,
)
class NewDocumentPage extends Component {
    constructor(props) {
        super(props);
    }

    _renderBlock = ({blockTitle, permission, items}, key) => {
        return !isForbidden(this.props.user, permissions[permission]) && (
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

    _renderItem = (blockTitle, {itemName, formLink, formLinkState, catalogueLink, catalogueLinkState, disabled, emptyItem, permission, permissionCRUD}, key) => {
        const isForbiddenAccess = permission ? isForbidden(this.props.user, permissions[permission]) : false;
        const isForbiddenCRUD = permissionCRUD ? isForbidden(this.props.user, permissions[permissionCRUD]) : false;
        return !emptyItem && !isForbiddenAccess ? (
            <div key={ key } className={ disabled || isForbiddenCRUD ? Styles.disabledItem + " " + Styles.item : Styles.item }>
                <Link
                    className={Styles.buttonLink}
                    to={ !isForbiddenCRUD && {
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
                    to={ !isForbiddenAccess && {
                        pathname: catalogueLink,
                        state:    catalogueLinkState,
                    } }
                >
                    <Icon className={Styles.folderIcon} type="folder-open" />
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
