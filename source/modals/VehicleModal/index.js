// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Modal, Tabs} from 'antd';
import _ from "lodash";

// proj
import { resetModal, MODALS, selectModal, selectModalProps } from 'core/modals/duck';
import {
    modes,
} from 'core/forms/vehicleForm/duck';

// own
import Styles from './styles.m.css';
import VehicleForm from './VehicleForm';

const TPane = Tabs.TabPane;

const mapStateToProps = state => ({
    currentForm:      state.forms.reportAnalyticsForm.currentForm, //Current active analytics form
    analyticsCatalogsLoading: state.forms.reportAnalyticsForm.analyticsCatalogsLoading,
    analyticsCatalogs:        state.forms.reportAnalyticsForm.analyticsCatalogs,

    modalProps:    selectModalProps(state),
    visible:       selectModal(state)
});

const mapDispatchToProps = {
    resetModal,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
/**
 */
export default class VehicleModal extends Component {

    //Use this if some modalProps are not initialized
    defaultModalProps = {
        mode: modes.ADD,
    }

    componentDidMount() {
    }    

    /**
     * Handle submit depending on mode is currently used
     * @param {*} e Event
     */
    handleSubmit = (e) => {
        e.preventDefault();

        this.vehicleForm.validateFields((err, values) => {
            if (!err) {
                console.log("OK: ", values);
            } 
        });
        
    };

    onCancel = () => {
        this.props.resetModal();
    }

    saveVehicleFormRef = (ref) => {
        this.vehicleForm = ref;
    }

    render() {

        const {
            visible,
            modalProps,
        } = this.props;

        const mode = _.get(modalProps, "mode", this.defaultModalProps.mode);
        console.log("Modal props: ", modalProps);
        console.log("this props: ", this.props);

        return (
            <div>
                Hello
                <Modal
                    destroyOnClose={true}
                    width={ '80%' }
                    visible={ visible === MODALS.VEHICLE }
                    onOk={ this.handleSubmit }
                    onCancel={ this.onCancel }
                    title={
                        <div className={Styles.title}>
                            Title here
                        </div>
                    }
                >
                    <div style={{minHeight: '50vh'}}>
                        <VehicleForm
                            getFormRefCB={this.saveVehicleFormRef}//Get form refference
                            mode={mode}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}
