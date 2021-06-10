// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
import { connect } from "react-redux";

// proj
import {Layout} from 'commons';


// own
import VehiclesTable from './components/VehiclesTable';
import {Button, Icon} from "antd";
import {setModal, MODALS} from "core/modals/duck";
import { VehicleModal } from "modals";
import { fetchVehicles } from "core/vehicles/duck";

const mapStateToProps = state => ({});
const mapDispatchToProps = {
    fetchVehicles,
    setModal,
}

/**
 * This page was created to maintain all vehicles of the station(show tables, subtables, controls and other).
 * There is used "feature first" files structure(reffer to react documentaion), it means
 * that each one time used component can be found deeper in a tree structure
 * 
 * Each subcomponent is self-sufficient and requires only necessary data from parrent,
 * other data can be fetched and stored by redux saga/duck.
 * 
 * This page accepts no parameters.
 * 
 * Release date: 31.05.2021
 */

// @withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehiclesPage extends Component {
    constructor(props) {
        super(props);
    }

    onAddVehicle = () => {
        this.props.setModal(MODALS.VEHICLE, {
            mode: "ADD",
            onClose: () => this.props.fetchVehicles()
    });
    }

    render() {

        return (
            <Layout
                title={<FormattedMessage id={ 'vehicles_page.title' }/>}
                description={<FormattedMessage id={'vehicles_page.description'}/>}
                controls={
                    <Button
                        style={ {
                            margin:   '0 15px 0 0',
                            fontSize: 18,
                        } }
                        onClick={ () => {
                            this.onAddVehicle()
                        }}
                    >
                        <FormattedMessage id={ 'vehicles_page.add_vehicle'}/>
                    </Button>
                }
            >
                <VehiclesTable />

                <VehicleModal />
            </Layout>
        )
    }
}