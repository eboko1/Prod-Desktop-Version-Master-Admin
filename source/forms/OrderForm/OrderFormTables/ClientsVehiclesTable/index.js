// vendor
import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';

// proj
import { Catcher } from 'commons';

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
                    id: 'add_client_form.delete_vehicle',
                }),
                key:    'delete-vehicle',
                render: (text, record) => (
                    <Button
                        type='primary'
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

export default ClientsVehiclesTable;
