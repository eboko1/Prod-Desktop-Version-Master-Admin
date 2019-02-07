// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// proj
import { setModal, resetModal, MODALS } from 'core/modals/duck';
import { createSupplier } from 'core/suppliers/duck';

import { Layout, StyledButton } from 'commons';
import { SuppliersTable } from 'components';
import { SupplierModal } from 'modals';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    modal:      state.modals.modal,
    modalProps: state.modals.modalProps,
});

const mapDispatchToProps = {
    setModal,
    resetModal,
    createSupplier,
};

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class SuppliersPage extends Component {
    render() {
        const {
            modal,
            setModal,
            resetModal,
            createSupplier,
            modalProps,
        } = this.props;

        return (
            <Layout
                title={ <FormattedMessage id='navigation.suppliers' /> }
                // description={ <FormattedMessage id='chart-page.description' /> }
                controls={
                    <div className={ Styles.buttonGroup }>
                        <StyledButton
                            type='secondary'
                            onClick={ () => setModal(MODALS.SUPPLIER) }
                        >
                            <FormattedMessage id='supplier-modal.add_supplier' />
                        </StyledButton>
                    </div>
                }
            >
                <SuppliersTable />
                <SupplierModal
                    visible={ modal }
                    resetModal={ resetModal }
                    createSupplier={ createSupplier }
                    modalProps={ modalProps }
                />
            </Layout>
        );
    }
}
