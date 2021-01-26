// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Table, Icon, Popconfirm, notification } from "antd";
import { Link } from 'react-router-dom';
import _ from "lodash";

// proj
import { setModal, MODALS } from "core/modals/duck";
import { fetchSuppliers, deleteSupplier } from "core/suppliers/duck";
import book from 'routes/book';

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    suppliers: state.suppliers.suppliers,
});

const mapDispatchToProps = {
    fetchSuppliers,
    deleteSupplier,
    setModal,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export class SuppliersTable extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: <FormattedMessage id="order_form_table.supplier" />,
                dataIndex: "name",
                key: "name",
                render: (name, {id}) => {
                    return (
                        <Link
                            to={ {
                                pathname: `${book.supplier}/${id}`,
                                state:    {tab: 'general'},
                            } }
                        >
                            {name}
                        </Link>
                    )
                }
            },
            {
                title: <FormattedMessage id="supplier.contact" />,
                dataIndex: "contactName",
                key: "contactName",
            },
            {
                title: <FormattedMessage id="supplier.phone" />,
                dataIndex: "phones",
                key: "phones",
                render: (phones, {id}) => {
                    return (
                        phones && phones.length ? phones[0] : null
                    )
                }
            },
            {
                title: <FormattedMessage id="supplier.debt" />,
                dataIndex: "debt",
                key: "debt",
                render: (debt, {id}) => {
                    return (
                        <Link
                            to={ {
                                pathname: `${book.supplier}/${id}`,
                                state:    {tab: 'debt'},
                            } }
                        >
                            {debt || 0} 
                        </Link>
                    )
                }
            },
            {
                title: <FormattedMessage id="supplier.orders" />,
                dataIndex: "incomeOrderDocsCount",
                key: "orders",
                render: (orders, {id}) => {
                    return (
                        <Link
                            to={ {
                                pathname: `${book.supplier}/${id}`,
                                state:    {tab: 'orders'},
                            } }
                        >
                            {orders || 0}
                        </Link>
                    )
                }
            },
            {
                title: <FormattedMessage id="supplier.supply" />,
                dataIndex: "expenseOrderDocsCount",
                key: "supply",
                render: (supply, {id}) => {
                    return (
                        <Link
                            to={ {
                                pathname: `${book.supplier}/${id}`,
                                state:    {tab: 'supply'},
                            } }
                        >
                            {supply || 0}
                        </Link>
                    )
                }
            },
            {
                title: <FormattedMessage id="supplier.show" />,
                dataIndex: "hide",
                key: "hide",
                render: (hide, {id}) => {
                    return (
                        !hide ? 
                        <Icon type='check' style={{color: 'var(--green)'}}/> :
                        <Icon type='close' style={{color: 'var(--warning)'}}/>
                    )
                }
            },
            {
                key: "actions",
                render: (row) => {
                    const disabled = row.expenseOrderDocsCount || row.incomeOrderDocsCount || !row.businessId;
                    return (
                        <div className={!disabled ? Styles.actions : Styles.disabledActions}>
                            <Popconfirm
                                title={`${props.intl.formatMessage({
                                    id: "delete",
                                })} ?`}
                                onConfirm={async () => {
                                    let token = localStorage.getItem('_my.carbook.pro_token');
                                    let url = __API_URL__ + `/business_suppliers/${row.id}`;
                                    try {
                                        const response = await fetch(url, {
                                            method:  'DELETE',
                                            headers: {
                                                Authorization:  token,
                                                'Content-Type': 'application/json',
                                            },
                                        });
                                        const result = await response.json();
                                        console.log(result)
                                        if(result.deleted) {
                                            props.fetchSuppliers();
                                        } else {
                                            notification.error({
                                                message: this.props.intl.formatMessage({id: 'error'})
                                            });
                                        }
                                    } catch (error) {
                                        console.error('ERROR:', error);
                                    }
                                    
                                }}
                            >
                                <Icon
                                    type="delete"
                                    className={!disabled ? Styles.deleteClientIcon : Styles.disabledDeleteIcon}
                                />
                            </Popconfirm>
                        </div>
                    )
                }
            },
        ];
    }

    componentDidMount() {
        this.props.fetchSuppliers();
    }

    render() {
        const { suppliersFetching, suppliers, isMobile } = this.props;

        return (
            <Table
                size="small"
                columns={isMobile ? this.columns.slice(0, -3) : this.columns}
                dataSource={suppliers}
                rowKey='id'
                loading={suppliersFetching}
                pagination={isMobile ? false : { hideOnSinglePage: true }}
                locale={{
                    emptyText: <FormattedMessage id="no_data" />,
                }}
            />
        );
    }
}
