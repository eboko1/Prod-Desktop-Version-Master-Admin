// vendor
import React, { Component } from "react";
import { Modal, Icon } from "antd";
import { connect } from "react-redux";

// proj
import { resetModal, MODALS } from "core/modals/duck";

import { SwitchBusinessForm } from "forms";

const mapStateToProps = state => {
    return {
        modal: state.modals.modal,
        loading: state.ui.searchBusinessesFetching,
    };
};

const mapDispatch = {
    resetModal,
};

@connect(
    mapStateToProps,
    mapDispatch,
)
export default class SwitchBusinessModal extends Component {
    render() {
        const { modal: visible, resetModal, loading, setBusiness } = this.props;

        return (
            <Modal
                title={<Icon type="home" />}
                visible={visible === MODALS.SWITCH_BUSINESS}
                onCancel={() => resetModal()}
                footer={null}
                destroyOnClose
            >
                <SwitchBusinessForm
                    setBusiness={setBusiness}
                    loading={loading}
                    resetModal={resetModal}
                />
            </Modal>
        );
    }
}
