// vendor
import React, { Component } from 'react';
import { Table } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
import { columnsConfig } from './config';

/**
 * Used to display vehicles and its basic controls
 * 
 * @property { Array } vehicles - Array of vehicles
 * @property { Function } removeClientVehicle - used to remove vehicle by its index
 * @property { Function({vehicle}) } openEditModal - used to open modal for editing vehicle without vehicleId
 */
@injectIntl
class ClientsVehiclesTable extends Component {
    constructor(props) {
        super(props);

        const {
            removeClientVehicle,
            intl,
            openEditModal,
        } = this.props;

        this.columns = columnsConfig({
            formatMessage: intl.formatMessage,
            removeClientVehicle: removeClientVehicle,
            openEditModal,   
        });
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