//vendor
import React from 'react';
import { FormattedMessage, injectIntl } from "react-intl";
import { Form, Col, Row} from 'antd';
import { connect } from 'react-redux';

//proj
import { Spinner } from 'commons';
import {
    fetchVehicle,

    selectVehicle,
    selectFetchingAllVehicleData,
} from 'core/forms/vehicleForm/duck';

//own
import Styles from './styles.m.css'

const mapStateToProps = state => ({
    user: state.auth,
    vehicle: selectVehicle(state),
    fetchingAllVehicleData: selectFetchingAllVehicleData(state,)
});

const mapDispatchToProps = {
    fetchVehicle,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
@Form.create({name: 'vehilce_view_form'})
export default class VehicleFormClass extends React.Component {
    constructor(props) {
        super(props);

        const {getFormRefCB} = this.props;
        getFormRefCB && getFormRefCB(this.props.form); //Callback to get form instance (warppedComponentRef does not work)

    }

    componentDidMount() {
        const {vehicleId} = this.props;
        this.props.fetchVehicle({vehicleId});
    }

    render() {
        const {
            fetchingAllVehicleData,
            vehicle,
        } = this.props;
        
        const vehicleValues = {
            number: vehicle.number,
            vin: vehicle.vin,
            year: vehicle.year,
            make: vehicle.make,
            model: vehicle.model,
            modification: vehicle.modification,
        }
        
        return fetchingAllVehicleData
            ? (<Spinner />)
            : (
                <Form>
                    <Row className={Styles.row}>
                        <Col span={10}>vehicleNumber: </Col>
                        <Col span={14}>
                            <div className={Styles.field}>
                                {vehicleValues.number}
                            </div>
                        </Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={10}>vehicleVin: </Col>
                        <Col span={14}>
                            <div className={Styles.field}>
                                {vehicleValues.vin}
                            </div>
                        </Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={10}>vehicleYear: </Col>
                        <Col span={14}>
                            <div className={Styles.field}>
                                {vehicleValues.year}
                            </div>
                        </Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={10}>vehicleMake: </Col>
                        <Col span={14}>
                            <div className={Styles.field}>
                                {vehicleValues.make}
                            </div>
                        </Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={10}>vehicleModel: </Col>
                        <Col span={14}>
                            <div className={Styles.field}>
                                {vehicleValues.model}
                            </div>
                        </Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={10}>vehicleModification: </Col>
                        <Col span={14}>
                            <div className={Styles.field}>
                                {vehicleValues.modification}
                            </div>
                        </Col>
                    </Row>
                </Form>
            );
    }
}