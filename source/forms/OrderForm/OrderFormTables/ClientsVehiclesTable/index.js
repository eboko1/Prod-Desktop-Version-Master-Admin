// vendor
import React, { Component } from 'react';
import { Table, Button, Icon, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';

// proj
import { Catcher } from 'commons';
import { AddClientVehicleForm } from 'forms';

// own
import Styles from './styles.m.css';

@injectIntl
class ClientsVehiclesTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: this.props.intl.formatMessage({
                    id: 'add_client_form.make',
                }),
                dataIndex: 'makeName',
                key:       'makeName',
            },
            {
                title: this.props.intl.formatMessage({
                    id: 'add_client_form.model',
                }),
                dataIndex: 'modelName',
                key:       'modelName',
            },
            {
                title: this.props.intl.formatMessage({
                    id: 'add_client_form.year',
                }),
                dataIndex: 'year',
                key:       'year',
            },
            {
                title: this.props.intl.formatMessage({
                    id: 'add_client_form.modification',
                }),
                dataIndex: 'modificationName',
                key:       'modificationName',
            },
            {
                title: this.props.intl.formatMessage({
                    id: 'add_client_form.vin',
                }),
                dataIndex: 'vin',
                key:       'vin',
            },
            {
                title: this.props.intl.formatMessage({
                    id: 'add_client_form.number',
                }),
                dataIndex: 'number',
                key:       'number',
            },
            {
                title: this.props.intl.formatMessage({
                    id: 'edit',
                }),
                key:    'edit-vehicle',
                render: (text, record) => {
                    return (
                        <EditVheliceModal
                            vehicle={ this.props.vehicles[ record.index ] }
                            addClientVehicle={ this.props.addClientVehicle }
                            index={ record.index }
                            removeClientVehicle={ this.props.removeClientVehicle }
                        />
                    );
                },
            },
            {
                title: this.props.intl.formatMessage({
                    id: 'add_client_form.delete_vehicle',
                }),
                key:    'delete-vehicle',
                render: (text, record) => (
                    <Button
                        type='danger'
                        onClick={ () =>
                            this.props.removeClientVehicle(record.index)
                        }
                    >
                        <FormattedMessage id='add_client_form.delete_vehicle' />
                    </Button>
                ),
            },
        ];
    }

    render() {
        const { vehicles } = this.props;
        const columns = this.columns;

        return (
            <Catcher>
                <Table
                    dataSource={ vehicles.map((vehicle, index) => ({
                        ...vehicle,
                        index,
                        key: v4(),
                    })) }
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
                >
                    <AddClientVehicleForm
                        { ...vehicle }
                        editClientVehicle={ this.editClientVehicle }
                        editMode
                    />
                </Modal>
            </>
        );
    }
}

export default ClientsVehiclesTable;
