// vendor
import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
import { columnsConfig } from './config';

@injectIntl
class ClientsVehiclesTable extends Component {
    constructor(props) {
        super(props);

        const {
            removeClientVehicle,
            intl
        } = this.props;

        this.columns = columnsConfig({
            formatMessage: intl.formatMessage,
            removeClientVehicle: removeClientVehicle,    
        });
    }

    onEditVehicle = () => {

    }

    render() {
        const { vehicles } = this.props;
        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    dataSource={ vehicles }
                    className={ Styles.clientsVehiclesTable }
                    columns={ columns }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }
}

class EditVheliceModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        };
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    editClientVehicle = vehicle => {
        const { addClientVehicle, removeClientVehicle, index } = this.props;
        removeClientVehicle(index);
        addClientVehicle(vehicle);
        this.handleCancel;
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const {
            vehicle,
            addClientVehicle,
            removeClientVehicle,
            index,
            vehicleTypes,
        } = this.props;

        const { visible } = this.state;

        return (
            <>
                <Button type='primary' onClick={ this.showModal }>
                    <FormattedMessage id='edit' />
                </Button>
                <Modal
                    visible={ visible }
                    title={ <FormattedMessage id='edit' /> }
                    onCancel={ this.handleCancel }
                    footer={ null }
                    maskClosable={false}
                >
                    <AddClientVehicleForm
                        { ...vehicle }
                        vehicleTypes={vehicleTypes}
                        editClientVehicle={ this.editClientVehicle }
                        editMode
                    />
                </Modal>
            </>
        );
    }
}


export default ClientsVehiclesTable;