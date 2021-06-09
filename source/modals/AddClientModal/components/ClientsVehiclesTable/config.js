// vendor
import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Icon, Popover, Button } from 'antd';
import _ from 'lodash';
import { v4 } from "uuid";

//Proj
import book from 'routes/book';
import { permissions, isForbidden } from 'utils';

export function columnsConfig(props) {

    const {
        formatMessage,
        removeClientVehicle,
    }= props;

    const makeNameCol = {
        title: formatMessage({
            id: 'add_client_form.make',
        }),
        dataIndex: 'makeName',
        key:       'makeName',
    }

    const modelNameCol = {
        title: formatMessage({
            id: 'add_client_form.model',
        }),
        dataIndex: 'modelName',
        key:       'modelName',
    }

    const yearCol = {
        title: formatMessage({
            id: 'add_client_form.year',
        }),
        dataIndex: 'year',
        key:       'year',
    }

    const modificationNameCol = {
        title: formatMessage({
            id: 'add_client_form.modification',
        }),
        dataIndex: 'modificationName',
        key:       'modificationName',
    }

    const vinCol = {
        title: formatMessage({
            id: 'add_client_form.vin',
        }),
        dataIndex: 'vin',
        key:       'vin',
    }
    
    const numberCol = {
        title: formatMessage({
            id: 'add_client_form.number',
        }),
        dataIndex: 'number',
        key:       'number',
    }

    const editCol = {
        title: this.props.intl.formatMessage({id: 'edit'}),
        key:    'edit',
        render: (text, record) => {
            return (
                <EditVheliceModal
                    vehicleTypes={ this.props.vehicleTypes}
                    vehicle={ this.props.vehicles[ record.index ] }
                    addClientVehicle={ this.props.addClientVehicle }
                    index={ record.index }
                    removeClientVehicle={ this.props.removeClientVehicle }
                />
            );
        },
    },
    
    const deleteCol = {
        title: formatMessage({
            id: 'add_client_form.delete_vehicle',
        }),
        key:    'delete',
        render: (text, record) => (
            <Button
                type='primary'
                onClick={ () =>
                    removeClientVehicle(record.index)
                }
            >
                <FormattedMessage id='add_client_form.delete_vehicle' />
            </Button>
        ),
    }

   
    return [
        makeNameCol,
        modelNameCol,
        yearCol,
        modificationNameCol,
        vinCol,
        numberCol,
        editCol,
        deleteCol,
    ];
}