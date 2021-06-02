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

/**
 * This form is used to show vehicle without editing it.
 * 
 * @param {Function} getFormRefCB - callback, takes one argument(form refference)
 * @param {number} vehicleId - Id of a vehicle you wnat to view
 */
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
@Form.create({name: 'vehilce_view_form'})
export default class ViewVehicleForm extends React.Component {
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
            number: vehicle.vehicleNumber,
            vin: vehicle.vehicleVin,
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
                        <Col span={10}>
                            <div className={Styles.colText}>
                            {<FormattedMessage id='add_client_form.number' />}
                            </div>
                        </Col>
                        <Col span={14}>
                            <div className={Styles.field}>
                                {vehicleValues.number}
                            </div>
                        </Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={10}>
                            <div className={Styles.colText}>
                            {<FormattedMessage id='add_order_form.vin' />}
                            </div>
                        </Col>
                        <Col span={14}>
                            <div className={Styles.field}>
                                {vehicleValues.vin}
                            </div>
                        </Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={10}>
                            <div className={Styles.colText}>
                            {<FormattedMessage id='add_client_form.year' />}
                            </div>
                        </Col>
                        <Col span={14}>
                            <div className={Styles.field}>
                                {vehicleValues.year}
                            </div>
                        </Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={10}>
                            <div className={Styles.colText}>
                            {<FormattedMessage id='add_client_form.make' />}
                            </div>
                        </Col>
                        <Col span={14}>
                            <div className={Styles.field}>
                                {vehicleValues.make}
                            </div>
                        </Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={10}>
                            <div className={Styles.colText}>
                            {<FormattedMessage id='add_client_form.model' />}
                            </div>
                        </Col>
                        <Col span={14}>
                            <div className={Styles.field}>
                                {vehicleValues.model}
                            </div>
                        </Col>
                    </Row>

                    <Row className={Styles.row}>
                        <Col span={10}>
                            <div className={Styles.colText}>
                            {<FormattedMessage id='add_client_form.modification' />}
                            </div>
                        </Col>
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