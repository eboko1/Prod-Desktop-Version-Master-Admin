// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal, Table, Icon } from 'antd';
import { v4 } from 'uuid';

// proj
import { Catcher } from 'commons';
import {
    clearVehicleNumberHistory,
    fetchVehicleNumberHistory,
} from 'core/vehicleNumberHistory/duck';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        history: state.vehicleNumberHistory.history,
    };
};

const mapDispatchToProps = {
    clearVehicleNumberHistory,
    fetchVehicleNumberHistory,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class VehicleNumberHistory extends Component {
    render() {
        const { history, vehicleNumber } = this.props;

        const columns = [
            {
                title:     <FormattedMessage id='dReg' />,
                width:     '10%',
                dataIndex: 'dReg',
            },
            {
                title:     <FormattedMessage id='makeYear' />,
                width:     '10%',
                dataIndex: 'makeYear',
            },
            {
                title:     <FormattedMessage id='brand' />,
                width:     '10%',
                dataIndex: 'brand',
            },
            {
                title:     <FormattedMessage id='model' />,
                width:     '10%',
                dataIndex: 'model',
            },
            {
                title:     <FormattedMessage id='fuel' />,
                width:     '10%',
                dataIndex: 'fuel',
            },
            {
                title:     <FormattedMessage id='body' />,
                width:     '10%',
                dataIndex: 'body',
            },
            {
                title:     <FormattedMessage id='nRegNew' />,
                width:     '10%',
                dataIndex: 'nRegNew',
            },
            {
                title:     <FormattedMessage id='operName' />,
                width:     '30%',
                dataIndex: 'operName',
            },
        ];

        return (
            <Catcher>
                <Icon
                    type='question-circle'
                    theme='filled'
                    className={ Styles.questionIcon }
                    disabled={ !vehicleNumber }
                    onClick={ () =>
                        vehicleNumber &&
                        this.props.fetchVehicleNumberHistory(vehicleNumber)
                    }
                />
                <Modal
                    width={ '80%' }
                    title={
                        <FormattedMessage id='vehicle_number_history.title' />
                    }
                    cancelText={ <FormattedMessage id='cancel' /> }
                    visible={ Boolean(history) }
                    onCancel={ () => this.props.clearVehicleNumberHistory() }
                    footer={ null }
                >
                    <Table rowKey={ v4 } columns={ columns } dataSource={ history } />
                </Modal>
            </Catcher>
        );
    }
}
