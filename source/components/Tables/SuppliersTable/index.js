// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Table, Icon, Popconfirm } from "antd";
import _ from "lodash";

// proj
import { setModal, MODALS } from "core/modals/duck";
import { fetchSuppliers, deleteSupplier } from "core/suppliers/duck";

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
                title: "№",
                dataIndex: "id",
                width: "25%",
            },
            {
                title: <FormattedMessage id="name" />,
                dataIndex: "name",
                width: "25%",
            },
            {
                width: "auto",
                dataIndex: "delete",
                render: (key, { id, name }) => (
                    <div className={Styles.actions}>
                        <Icon
                            className={Styles.editClientIcon}
                            type="edit"
                            onClick={() =>
                                props.setModal(MODALS.SUPPLIER, { id, name })
                            }
                        />
                        <div className={Styles.actionsLine} />
                        <Popconfirm
                            title={`${props.intl.formatMessage({
                                id: "delete",
                            })} ?`}
                            onConfirm={() => props.deleteSupplier(id)}
                        >
                            <Icon
                                type="delete"
                                className={Styles.deleteClientIcon}
                            />
                        </Popconfirm>
                    </div>
                ),
            },
        ];
    }

    componentDidMount() {
        this.props.fetchSuppliers();
    }

    render() {
        const { suppliersFetching, suppliers } = this.props;

        return (
            <Table
                size="small"
                columns={this.columns}
                dataSource={suppliers}
                loading={suppliersFetching}
                pagination={{ hideOnSinglePage: true }}
                locale={{
                    emptyText: <FormattedMessage id="no_data" />,
                }}
            />
        );
    }
}
