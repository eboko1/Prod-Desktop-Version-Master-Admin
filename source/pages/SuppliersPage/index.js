// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

// proj
import { setModal, selectModalProps, MODALS } from "core/modals/duck";

import { Layout, StyledButton } from "commons";
import { SuppliersTable } from "components";
import { SupplierModal } from "modals";

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    modalProps: selectModalProps(state),
});

const mapDispatchToProps = {
    setModal,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class SuppliersPage extends Component {
    render() {
        const { setModal, modalProps } = this.props;

        return (
            <Layout
                title={<FormattedMessage id="navigation.suppliers" />}
                controls={
                    <div className={Styles.buttonGroup}>
                        <StyledButton
                            type="secondary"
                            onClick={() => setModal(MODALS.SUPPLIER)}
                        >
                            <FormattedMessage id="supplier-modal.add_supplier" />
                        </StyledButton>
                    </div>
                }
            >
                <SuppliersTable />
                <SupplierModal modalProps={modalProps} />
            </Layout>
        );
    }
}
